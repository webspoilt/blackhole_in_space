// 👤 Client - WebSocket Client Connection
//
// Manages a single client connection, handling read/write pumps
// and message processing.

package client

import (
	"encoding/json"
	"sync"
	"time"

	"github.com/forticomm/blackhole/server/internal/hub"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
)

const (
	// Time allowed to write a message
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message
	pongWait = 60 * time.Second

	// Send pings to peer with this period
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size
	maxMessageSize = 65536
)

// Client represents a single WebSocket connection
type Client struct {
	// Unique client ID (hashed public key)
	ID string

	// Hub reference
	hub *hub.Hub

	// WebSocket connection
	conn *websocket.Conn

	// Remote address
	RemoteAddr string

	// Buffered channel of outbound messages
	Send chan *hub.Message

	// Client metadata
	Metadata map[string]interface{}

	// Connection state
	mu     sync.RWMutex
	closed bool
}

// New creates a new Client
func New(conn *websocket.Conn, remoteAddr string, h *hub.Hub) *Client {
	return &Client{
		ID:         generateClientID(),
		hub:        h,
		conn:       conn,
		RemoteAddr: remoteAddr,
		Send:       make(chan *hub.Message, 256),
		Metadata:   make(map[string]interface{}),
		closed:     false,
	}
}

// generateClientID generates a unique client ID
func generateClientID() string {
	// In production, this would be derived from the client's public key
	// For now, generate a random ID
	b := make([]byte, 16)
	for i := range b {
		b[i] = byte(time.Now().UnixNano() >> (i * 8))
	}
	return hexEncode(b)
}

// hexEncode encodes bytes to hex string
func hexEncode(data []byte) string {
	const hexChars = "0123456789abcdef"
	result := make([]byte, len(data)*2)
	for i, b := range data {
		result[i*2] = hexChars[b>>4]
		result[i*2+1] = hexChars[b&0x0f]
	}
	return string(result)
}

// ReadPump pumps messages from the WebSocket connection to the hub
func (c *Client) ReadPump() {
	defer func() {
		c.hub.Unregister <- c
		c.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Error().Err(err).Str("client_id", c.ID).Msg("WebSocket read error")
			}
			break
		}

		// Parse message
		var msg hub.Message
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Error().Err(err).Str("client_id", c.ID).Msg("Failed to parse message")
			continue
		}

		// Set sender (enforced by server)
		msg.From = c.ID
		msg.Timestamp = time.Now().Unix()

		// Validate message
		if msg.To == "" {
			log.Warn().Str("client_id", c.ID).Msg("Message missing recipient")
			continue
		}

		if len(msg.Payload) == 0 {
			log.Warn().Str("client_id", c.ID).Msg("Message missing payload")
			continue
		}

		// Route message
		c.hub.Broadcast(&msg)
	}
}

// WritePump pumps messages from the hub to the WebSocket connection
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Hub closed the channel
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			// Marshal message
			data, err := json.Marshal(message)
			if err != nil {
				log.Error().Err(err).Str("client_id", c.ID).Msg("Failed to marshal message")
				continue
			}

			// Send message
			if err := c.conn.WriteMessage(websocket.TextMessage, data); err != nil {
				log.Error().Err(err).Str("client_id", c.ID).Msg("Failed to write message")
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// Close closes the client connection
func (c *Client) Close() {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.closed {
		return
	}

	c.closed = true
	close(c.Send)
	c.conn.Close()

	log.Debug().Str("client_id", c.ID).Msg("Client connection closed")
}

// IsClosed returns true if the client is closed
func (c *Client) IsClosed() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.closed
}

// SetID sets the client ID (used after authentication)
func (c *Client) SetID(id string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.ID = id
}

// GetMetadata gets a metadata value
func (c *Client) GetMetadata(key string) (interface{}, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	val, ok := c.Metadata[key]
	return val, ok
}

// SetMetadata sets a metadata value
func (c *Client) SetMetadata(key string, value interface{}) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.Metadata[key] = value
}
