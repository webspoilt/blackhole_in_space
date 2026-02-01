// WebSocket Client - Handles individual client connections

package relay

import (
	"bytes"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second

	// Send pings to peer with this period (must be less than pongWait)
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer
	maxMessageSize = 512 * 1024 // 512 KB
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

// Client is a middleman between the websocket connection and the hub
type Client struct {
	Hub *Hub

	// Unique client identifier
	ID string

	// The websocket connection
	Conn *websocket.Conn

	// Buffered channel of outbound messages
	Send chan []byte
}

// ReadPump pumps messages from the websocket connection to the hub
//
// The application runs ReadPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) ReadPump() {
	defer func() {
		c.Hub.Unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("⚠️ WebSocket error: %v", err)
			}
			break
		}

		// Parse the message envelope
		envelope, err := c.parseMessage(message)
		if err != nil {
			log.Printf("❌ Failed to parse message from %s: %v", c.ID, err)
			continue
		}

		// Validate the envelope
		if err := c.validateEnvelope(envelope); err != nil {
			log.Printf("❌ Invalid envelope from %s: %v", c.ID, err)
			continue
		}

		// Relay the message
		success := c.Hub.RelayMessage(envelope)
		if !success {
			log.Printf("📬 Message from %s queued for %s", c.ID, envelope.To)
		}
	}
}

// WritePump pumps messages from the hub to the websocket connection
//
// A goroutine running WritePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			// Write the message
			w, err := c.Conn.NextWriter(websocket.BinaryMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued messages to the current websocket message
			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// parseMessage parses a raw WebSocket message into a MessageEnvelope
func (c *Client) parseMessage(data []byte) (*MessageEnvelope, error) {
	// Clean up the message (remove newlines and spaces)
	data = bytes.TrimSpace(bytes.Replace(data, newline, space, -1))

	// Parse JSON envelope
	var envelope MessageEnvelope
	if err := json.Unmarshal(data, &envelope); err != nil {
		return nil, err
	}

	return &envelope, nil
}

// validateEnvelope validates a message envelope
func (c *Client) validateEnvelope(envelope *MessageEnvelope) error {
	// Check required fields
	if envelope.ID == "" {
		return ErrMissingField("id")
	}
	if envelope.To == "" {
		return ErrMissingField("to")
	}
	if envelope.From == "" {
		return ErrMissingField("from")
	}
	if len(envelope.Payload) == 0 {
		return ErrMissingField("payload")
	}

	// Check payload size (max 256 KB for messages)
	if len(envelope.Payload) > 256*1024 {
		return ErrPayloadTooLarge
	}

	// Set TTL if not provided (default 24 hours)
	if envelope.TTL == 0 {
		envelope.TTL = time.Now().Add(24 * time.Hour).Unix()
	}

	// Set timestamp if not provided
	if envelope.Timestamp == 0 {
		envelope.Timestamp = time.Now().Unix()
	}

	return nil
}

// SendError sends an error message to the client
func (c *Client) SendError(errorCode string, message string) {
	errorMsg := map[string]string{
		"type":    "error",
		"code":    errorCode,
		"message": message,
	}

	data, _ := json.Marshal(errorMsg)
	select {
	case c.Send <- data:
	default:
		// Channel is full, log and drop
		log.Printf("Failed to send error to %s: channel full", c.ID)
	}
}

// SendAck sends an acknowledgment for a received message
func (c *Client) SendAck(messageID string) {
	ack := map[string]string{
		"type":       "ack",
		"message_id": messageID,
	}

	data, _ := json.Marshal(ack)
	select {
	case c.Send <- data:
	default:
		log.Printf("Failed to send ack to %s: channel full", c.ID)
	}
}

// Custom errors
type ErrMissingField string

func (e ErrMissingField) Error() string {
	return "missing required field: " + string(e)
}

var ErrPayloadTooLarge = ErrSize("payload exceeds maximum size")

type ErrSize string

func (e ErrSize) Error() string {
	return string(e)
}

// Import json for parsing
import "encoding/json"
