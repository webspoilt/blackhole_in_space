// 📡 Message Hub - The Core of the Black Hole Relay
//
// The hub manages client connections and message routing.
// It operates on a "zero-storage" principle - messages are either
// delivered immediately or stored ephemerally until TTL expires.

package hub

import (
	"sync"
	"time"

	"github.com/forticomm/blackhole/server/internal/client"
	"github.com/forticomm/blackhole/server/internal/config"
	"github.com/gorilla/websocket"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/rs/zerolog/log"
)

// Metrics
var (
	clientsConnected = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "blackhole_clients_connected",
		Help: "Number of currently connected clients",
	})

	messagesReceived = promauto.NewCounter(prometheus.CounterOpts{
		Name: "blackhole_messages_received_total",
		Help: "Total number of messages received",
	})

	messagesDelivered = promauto.NewCounter(prometheus.CounterOpts{
		Name: "blackhole_messages_delivered_total",
		Help: "Total number of messages delivered",
	})

	messagesStored = promauto.NewGauge(prometheus.GaugeOpts{
		Name: "blackhole_messages_stored",
		Help: "Number of messages currently stored (undelivered)",
	})

	messageLatency = promauto.NewHistogram(prometheus.HistogramOpts{
		Name:    "blackhole_message_latency_seconds",
		Help:    "Message delivery latency",
		Buckets: prometheus.DefBuckets,
	})
)

// Hub manages all client connections and message routing
type Hub struct {
	// Configuration
	config *config.Config

	// Registered clients
	clients map[string]*client.Client

	// Client mutex
	clientsMu sync.RWMutex

	// Ephemeral message queue (for offline recipients)
	messageQueue map[string][]*QueuedMessage

	// Queue mutex
	queueMu sync.RWMutex

	// Broadcast channel
	broadcast chan *Message

	// Register channel
	register chan *client.Client

	// Unregister channel
	unregister chan *client.Client

	// Shutdown signal
	done chan struct{}

	// WaitGroup for goroutines
	wg sync.WaitGroup
}

// Message represents a relayed message
type Message struct {
	// Recipient ID (hashed public key)
	To string `json:"to"`

	// Sender ID (hashed public key, may be sealed)
	From string `json:"from"`

	// Encrypted payload (opaque to relay)
	Payload []byte `json:"payload"`

	// Message timestamp
	Timestamp int64 `json:"timestamp"`

	// Message type
	Type string `json:"type"`

	// Sequence number for ordering
	Sequence uint64 `json:"sequence"`
}

// QueuedMessage is a message stored for offline delivery
type QueuedMessage struct {
	Message      *Message
	ReceivedAt   time.Time
	DeliverAfter time.Time
	TTL          time.Duration
}

// New creates a new Hub
func New(cfg *config.Config) *Hub {
	return &Hub{
		config:       cfg,
		clients:      make(map[string]*client.Client),
		messageQueue: make(map[string][]*QueuedMessage),
		broadcast:    make(chan *Message, 256),
		register:     make(chan *client.Client),
		unregister:   make(chan *client.Client),
		done:         make(chan struct{}),
	}
}

// Run starts the hub's main event loop
func (h *Hub) Run() {
	log.Info().Msg("📡 Hub event loop started")

	for {
		select {
		case client := <-h.register:
			h.registerClient(client)

		case client := <-h.unregister:
			h.unregisterClient(client)

		case message := <-h.broadcast:
			h.routeMessage(message)

		case <-h.done:
			log.Info().Msg("📡 Hub event loop stopped")
			return
		}
	}
}

// registerClient adds a new client
func (h *Hub) registerClient(c *client.Client) {
	h.clientsMu.Lock()
	defer h.clientsMu.Unlock()

	// Check if client already exists
	if oldClient, exists := h.clients[c.ID]; exists {
		log.Warn().Str("client_id", c.ID).Msg("Client reconnected, closing old connection")
		oldClient.Close()
	}

	h.clients[c.ID] = c
	clientsConnected.Inc()

	log.Info().
		Str("client_id", c.ID).
		Str("remote_addr", c.RemoteAddr).
		Int("total_clients", len(h.clients)).
		Msg("👤 Client registered")

	// Deliver any queued messages
	go h.deliverQueuedMessages(c.ID)
}

// unregisterClient removes a client
func (h *Hub) unregisterClient(c *client.Client) {
	h.clientsMu.Lock()
	defer h.clientsMu.Unlock()

	if _, exists := h.clients[c.ID]; exists {
		delete(h.clients, c.ID)
		c.Close()
		clientsConnected.Dec()

		log.Info().
			Str("client_id", c.ID).
			Int("total_clients", len(h.clients)).
			Msg("👤 Client unregistered")
	}
}

// routeMessage routes a message to its recipient
func (h *Hub) routeMessage(msg *Message) {
	messagesReceived.Inc()
	start := time.Now()

	h.clientsMu.RLock()
	recipient, online := h.clients[msg.To]
	h.clientsMu.RUnlock()

	if online {
		// Deliver immediately
		select {
		case recipient.Send <- msg:
			messagesDelivered.Inc()
			messageLatency.Observe(time.Since(start).Seconds())
			log.Debug().
				Str("to", msg.To).
				Str("type", msg.Type).
				Msg("📨 Message delivered")
		default:
			// Client send buffer full, queue message
			log.Warn().Str("to", msg.To).Msg("Client buffer full, queuing message")
			h.queueMessage(msg)
		}
	} else {
		// Recipient offline, queue for later delivery
		log.Debug().
			Str("to", msg.To).
			Str("type", msg.Type).
			Msg("📬 Recipient offline, queuing message")
		h.queueMessage(msg)
	}
}

// queueMessage stores a message for later delivery
func (h *Hub) queueMessage(msg *Message) {
	h.queueMu.Lock()
	defer h.queueMu.Unlock()

	queued := &QueuedMessage{
		Message:      msg,
		ReceivedAt:   time.Now(),
		DeliverAfter: time.Now(),
		TTL:          time.Duration(h.config.MessageTTLSeconds) * time.Second,
	}

	h.messageQueue[msg.To] = append(h.messageQueue[msg.To], queued)
	messagesStored.Inc()

	log.Debug().
		Str("to", msg.To).
		Int("queue_size", len(h.messageQueue[msg.To])).
		Msg("📬 Message queued")
}

// deliverQueuedMessages delivers any queued messages to a client
func (h *Hub) deliverQueuedMessages(clientID string) {
	h.queueMu.Lock()
	queued, exists := h.messageQueue[clientID]
	if !exists || len(queued) == 0 {
		h.queueMu.Unlock()
		return
	}

	// Clear the queue
	delete(h.messageQueue, clientID)
	h.queueMu.Unlock()

	// Get client
	h.clientsMu.RLock()
	client, online := h.clients[clientID]
	h.clientsMu.RUnlock()

	if !online {
		log.Warn().Str("client_id", clientID).Msg("Client went offline before delivering queued messages")
		return
	}

	// Deliver messages
	for _, q := range queued {
		select {
		case client.Send <- q.Message:
			messagesDelivered.Inc()
			log.Debug().
				Str("to", clientID).
				Str("type", q.Message.Type).
				Msg("📨 Queued message delivered")
		default:
			log.Warn().Str("to", clientID).Msg("Failed to deliver queued message")
		}
	}

	messagesStored.Sub(float64(len(queued)))

	log.Info().
		Str("client_id", clientID).
		Int("delivered", len(queued)).
		Msg("📬 Queued messages delivered")
}

// StartCleanupRoutine periodically cleans up expired messages
func (h *Hub) StartCleanupRoutine() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			h.cleanupExpiredMessages()
		case <-h.done:
			return
		}
	}
}

// cleanupExpiredMessages removes expired messages from the queue
func (h *Hub) cleanupExpiredMessages() {
	h.queueMu.Lock()
	defer h.queueMu.Unlock()

	now := time.Now()
	var expiredCount int

	for clientID, queue := range h.messageQueue {
		var valid []*QueuedMessage
		for _, msg := range queue {
			if now.Sub(msg.ReceivedAt) < msg.TTL {
				valid = append(valid, msg)
			} else {
				expiredCount++
			}
		}

		if len(valid) == 0 {
			delete(h.messageQueue, clientID)
		} else {
			h.messageQueue[clientID] = valid
		}
	}

	if expiredCount > 0 {
		messagesStored.Sub(float64(expiredCount))
		log.Info().Int("expired", expiredCount).Msg("🧹 Cleaned up expired messages")
	}
}

// StartFederationListener starts the federation server
func (h *Hub) StartFederationListener() {
	log.Info().Msg("🌐 Federation listener started")
	// TODO: Implement federation protocol
}

// HandleWebSocket handles WebSocket connections
func (h *Hub) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			// In production, implement proper origin checking
			return true
		},
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Error().Err(err).Msg("WebSocket upgrade failed")
		return
	}

	// Create client
	c := client.New(conn, r.RemoteAddr, h)

	// Register client
	h.register <- c

	// Start client goroutines
	go c.WritePump()
	go c.ReadPump()
}

// Broadcast sends a message to all connected clients (for system messages)
func (h *Hub) Broadcast(msg *Message) {
	h.broadcast <- msg
}

// Close shuts down the hub
func (h *Hub) Close() {
	close(h.done)

	// Close all client connections
	h.clientsMu.Lock()
	for _, c := range h.clients {
		c.Close()
	}
	h.clients = make(map[string]*client.Client)
	h.clientsMu.Unlock()

	// Clear message queue
	h.queueMu.Lock()
	h.messageQueue = make(map[string][]*QueuedMessage)
	h.queueMu.Unlock()

	log.Info().Msg("📡 Hub closed")
}
