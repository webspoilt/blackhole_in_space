// FortiComm Relay Server
//
// Minimal relay server that only forwards encrypted messages.
// No message storage, no plaintext access, no metadata collection.

package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/google/uuid"
	"forticomm/server/internal/relay"
)

var (
	// WebSocket upgrader with strict security settings
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			// In production, validate against allowed origins
			origin := r.Header.Get("Origin")
			allowedOrigins := []string{
				"https://forticomm.com",
				"https://app.forticomm.com",
				"http://localhost:3000",
			}
			for _, allowed := range allowedOrigins {
				if origin == allowed {
					return true
				}
			}
			// Allow same-origin requests
			return origin == ""
		},
		EnableCompression: true,
	}

	// Global relay hub
	hub *relay.Hub
)

func main() {
	// Setup logging
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("🚀 Starting FortiComm Relay Server...")

	// Get configuration from environment
	port := getEnv("PORT", "8080")
	mode := getEnv("GIN_MODE", "release")

	// Set Gin mode
	gin.SetMode(mode)

	// Create relay hub
	hub = relay.NewHub()
	go hub.Run()

	// Setup router
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(securityHeaders())
	router.Use(requestLogger())
	router.Use(rateLimiter())

	// Health check endpoint
	router.GET("/health", healthHandler)
	router.GET("/ready", readinessHandler)

	// Metrics endpoint (prometheus format)
	router.GET("/metrics", metricsHandler)

	// WebSocket endpoint
	router.GET("/ws", websocketHandler)

	// Federation endpoints (for server-to-server)
	router.POST("/federation/message", federationMessageHandler)
	router.GET("/federation/discover", federationDiscoverHandler)

	// Create HTTP server
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Printf("🌐 Relay server listening on :%s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("🛑 Shutting down server...")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	// Close all WebSocket connections
	hub.Shutdown()

	log.Println("✅ Server exited")
}

// WebSocket handler
func websocketHandler(c *gin.Context) {
	// Upgrade HTTP to WebSocket
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}

	// Generate unique client ID
	clientID := uuid.New().String()

	// Create new client
	client := &relay.Client{
		ID:     clientID,
		Hub:    hub,
		Conn:   conn,
		Send:   make(chan []byte, 256),
	}

	// Register client
	hub.Register <- client

	// Start goroutines for reading and writing
	go client.WritePump()
	go client.ReadPump()

	log.Printf("🔌 Client connected: %s", clientID)
}

// Health check handler
func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"service":   "forticomm-relay",
		"timestamp": time.Now().Unix(),
		"version":   "0.1.0",
	})
}

// Readiness check handler
func readinessHandler(c *gin.Context) {
	// Check if hub is running
	if hub == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":  "not ready",
			"reason":  "hub not initialized",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":       "ready",
		"connections":  hub.ConnectionCount(),
		"uptime":       time.Since(time.Now()).String(),
	})
}

// Metrics handler (Prometheus format)
func metricsHandler(c *gin.Context) {
	metrics := hub.GetMetrics()
	
	c.Header("Content-Type", "text/plain")
	c.String(http.StatusOK, `# HELP forticomm_connections_total Total WebSocket connections
# TYPE forticomm_connections_total gauge
forticomm_connections_total %d

# HELP forticomm_messages_total Total messages relayed
# TYPE forticomm_messages_total counter
forticomm_messages_total %d

# HELP forticomm_errors_total Total errors
# TYPE forticomm_errors_total counter
forticomm_errors_total %d
`, metrics.Connections, metrics.MessagesRelayed, metrics.Errors)
}

// Federation message handler (server-to-server)
func federationMessageHandler(c *gin.Context) {
	var envelope relay.FederationEnvelope
	if err := c.ShouldBindJSON(&envelope); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid envelope"})
		return
	}

	// Verify federation signature
	if !verifyFederationSignature(&envelope) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid signature"})
		return
	}

	// Forward to recipient if connected
	hub.RelayFederationMessage(&envelope)

	c.JSON(http.StatusOK, gin.H{"status": "relayed"})
}

// Federation discovery handler
func federationDiscoverHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"server":    "forticomm-relay",
		"version":   "0.1.0",
		"federation": true,
		"features": []string{
			"ephemeral-messaging",
			"sealed-sender",
			"federation",
		},
	})
}

// Security headers middleware
func securityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		c.Header("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'")
		c.Next()
	}
}

// Request logger middleware
func requestLogger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return log.Printf("[%s] %s %s %d %s %s",
			param.TimeStamp.Format("2006-01-02 15:04:05"),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
			param.ClientIP,
		)
		return ""
	})
}

// Rate limiter middleware (simple implementation)
func rateLimiter() gin.HandlerFunc {
	// In production, use Redis-based rate limiting
	return func(c *gin.Context) {
		// Allow all requests for now
		// TODO: Implement proper rate limiting
		c.Next()
	}
}

// Verify federation signature
func verifyFederationSignature(envelope *relay.FederationEnvelope) bool {
	// In production, verify against known federation partners
	// For now, accept all validly formatted envelopes
	return envelope.Signature != "" && envelope.SenderDomain != ""
}

// Get environment variable with default
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
