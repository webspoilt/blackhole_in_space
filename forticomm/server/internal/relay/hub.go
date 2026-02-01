// Relay Hub - Manages all WebSocket connections and message routing

package relay

import (
	"log"
	"sync"
	"time"
)

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	// Registered clients
	clients map[string]*Client

	// Register requests from clients
	Register chan *Client

	// Unregister requests from clients
	Unregister chan *Client

	// Message queue for offline clients (24h TTL)
	messageQueue map[string][]*QueuedMessage

	// Mutex for thread-safe access
	mutex sync.RWMutex

	// Metrics
	metrics *Metrics

	// Shutdown signal
	shutdown chan bool
}

// QueuedMessage represents a message waiting for delivery
type QueuedMessage struct {
	Envelope  *MessageEnvelope
	Timestamp time.Time
	TTL       time.Duration
}

// MessageEnvelope represents an encrypted message
type MessageEnvelope struct {
	ID        string `json:"id"`
	To        string `json:"to"`        // Recipient ID (encrypted)
	From      string `json:"from"`      // Sender ID (encrypted via Sealed Sender)
	Payload   []byte `json:"payload"`   // Encrypted message body
	Timestamp int64  `json:"timestamp"`
	TTL       int64  `json:"ttl"`       // Time-to-live (24 hours default)
}

// FederationEnvelope for server-to-server messaging
type FederationEnvelope struct {
	ID           string `json:"id"`
	To           string `json:"to"`
	From         string `json:"from"`
	Payload      []byte `json:"payload"`
	SenderDomain string `json:"sender_domain"`
	Signature    string `json:"signature"`
	Timestamp    int64  `json:"timestamp"`
}

// Metrics for monitoring
type Metrics struct {
	Connections     int
	MessagesRelayed int64
	Errors          int64
}

// NewHub creates a new Hub instance
func NewHub() *Hub {
	hub := &Hub{
		Register:     make(chan *Client),
		Unregister:   make(chan *Client),
		clients:      make(map[string]*Client),
		messageQueue: make(map[string][]*QueuedMessage),
		metrics:      &Metrics{},
		shutdown:     make(chan bool),
	}

	// Start cleanup goroutine
	go hub.cleanupRoutine()

	return hub
}

// Run starts the hub's main event loop
func (h *Hub) Run() {
	log.Println("🔄 Hub event loop started")

	for {
		select {
		case client := <-h.Register:
			h.mutex.Lock()
			h.clients[client.ID] = client
			h.metrics.Connections++
			h.mutex.Unlock()

			// Send any queued messages
			go h.deliverQueuedMessages(client)

			log.Printf("👤 Client registered: %s (total: %d)", client.ID, h.metrics.Connections)

		case client := <-h.Unregister:
			h.mutex.Lock()
			if _, ok := h.clients[client.ID]; ok {
				delete(h.clients, client.ID)
				close(client.Send)
				h.metrics.Connections--
			}
			h.mutex.Unlock()

			log.Printf("👋 Client unregistered: %s (total: %d)", client.ID, h.metrics.Connections)

		case <-h.shutdown:
			log.Println("🛑 Hub shutting down")
			return
		}
	}
}

// Shutdown gracefully shuts down the hub
func (h *Hub) Shutdown() {
	close(h.shutdown)

	h.mutex.Lock()
	defer h.mutex.Unlock()

	// Close all client connections
	for id, client := range h.clients {
		client.Conn.Close()
		delete(h.clients, id)
		log.Printf("Closed connection: %s", id)
	}
}

// RelayMessage sends a message to a specific recipient
func (h *Hub) RelayMessage(envelope *MessageEnvelope) bool {
	h.mutex.RLock()
	client, exists := h.clients[envelope.To]
	h.mutex.RUnlock()

	if exists {
		// Client is online, send immediately
		select {
		case client.Send <- envelope.Payload:
			h.mutex.Lock()
			h.metrics.MessagesRelayed++
			h.mutex.Unlock()
			log.Printf("📨 Message relayed to %s", envelope.To)
			return true
		default:
			// Client's send buffer is full, queue the message
			h.queueMessage(envelope)
			return false
		}
	}

	// Client is offline, queue the message
	h.queueMessage(envelope)
	return false
}

// RelayFederationMessage handles server-to-server messages
func (h *Hub) RelayFederationMessage(envelope *FederationEnvelope) bool {
	// Convert to internal envelope
	internal := &MessageEnvelope{
		ID:        envelope.ID,
		To:        envelope.To,
		From:      envelope.From,
		Payload:   envelope.Payload,
		Timestamp: envelope.Timestamp,
		TTL:       time.Now().Add(24 * time.Hour).Unix(),
	}

	return h.RelayMessage(internal)
}

// queueMessage stores a message for later delivery
func (h *Hub) queueMessage(envelope *MessageEnvelope) {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	queued := &QueuedMessage{
		Envelope:  envelope,
		Timestamp: time.Now(),
		TTL:       24 * time.Hour,
	}

	h.messageQueue[envelope.To] = append(h.messageQueue[envelope.To], queued)
	log.Printf("📬 Message queued for %s (queue size: %d)",
		envelope.To, len(h.messageQueue[envelope.To]))
}

// deliverQueuedMessages sends any queued messages to a newly connected client
func (h *Hub) deliverQueuedMessages(client *Client) {
	h.mutex.Lock()
	queued, exists := h.messageQueue[client.ID]
	if !exists || len(queued) == 0 {
		h.mutex.Unlock()
		return
	}

	// Remove from queue
	delete(h.messageQueue, client.ID)
	h.mutex.Unlock()

	// Send all queued messages
	for _, msg := range queued {
		select {
		case client.Send <- msg.Envelope.Payload:
			h.mutex.Lock()
			h.metrics.MessagesRelayed++
			h.mutex.Unlock()
			log.Printf("📨 Queued message delivered to %s", client.ID)
		case <-time.After(5 * time.Second):
			log.Printf("⚠️ Timeout delivering queued message to %s", client.ID)
		}
	}

	log.Printf("✅ Delivered %d queued messages to %s", len(queued), client.ID)
}

// cleanupRoutine removes expired messages from the queue
func (h *Hub) cleanupRoutine() {
	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			h.cleanupExpiredMessages()
		case <-h.shutdown:
			return
		}
	}
}

// cleanupExpiredMessages removes expired messages from the queue
func (h *Hub) cleanupExpiredMessages() {
	h.mutex.Lock()
	defer h.mutex.Unlock()

	now := time.Now()
	totalRemoved := 0

	for recipient, messages := range h.messageQueue {
		var validMessages []*QueuedMessage
		for _, msg := range messages {
			if now.Sub(msg.Timestamp) < msg.TTL {
				validMessages = append(validMessages, msg)
			} else {
				totalRemoved++
			}
		}

		if len(validMessages) == 0 {
			delete(h.messageQueue, recipient)
		} else {
			h.messageQueue[recipient] = validMessages
		}
	}

	if totalRemoved > 0 {
		log.Printf("🧹 Cleaned up %d expired messages", totalRemoved)
	}
}

// ConnectionCount returns the number of connected clients
func (h *Hub) ConnectionCount() int {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	return h.metrics.Connections
}

// GetMetrics returns current metrics
func (h *Hub) GetMetrics() *Metrics {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	return &Metrics{
		Connections:     h.metrics.Connections,
		MessagesRelayed: h.metrics.MessagesRelayed,
		Errors:          h.metrics.Errors,
	}
}

// IsClientConnected checks if a client is currently connected
func (h *Hub) IsClientConnected(clientID string) bool {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	_, exists := h.clients[clientID]
	return exists
}

// GetQueueSize returns the number of queued messages for a recipient
func (h *Hub) GetQueueSize(recipientID string) int {
	h.mutex.RLock()
	defer h.mutex.RUnlock()
	return len(h.messageQueue[recipientID])
}
