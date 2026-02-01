// 🕳️ FortiComm Black Hole Relay Server
//
// This is the message relay server for FortiComm Black Hole.
// It operates as a zero-knowledge relay - it cannot decrypt messages.
// Messages are stored ephemerally and deleted after delivery or TTL.

package main

import (
	"context"
	"flag"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/forticomm/blackhole/server/internal/config"
	"github.com/forticomm/blackhole/server/internal/hub"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

var (
	// Version info (set by build flags)
	Version   = "dev"
	BuildTime = "unknown"
	GitCommit = "unknown"
)

func main() {
	// Parse flags
	configPath := flag.String("config", "config.yaml", "Path to configuration file")
	showVersion := flag.Bool("version", false, "Show version and exit")
	flag.Parse()

	// Show version
	if *showVersion {
		log.Info().
			Str("version", Version).
			Str("build_time", BuildTime).
			Str("git_commit", GitCommit).
			Msg("FortiComm Black Hole Relay")
		return
	}

	// Setup logging
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339})

	log.Info().
		Str("version", Version).
		Msg("🕳️ Starting FortiComm Black Hole Relay Server")

	// Load configuration
	cfg, err := config.Load(*configPath)
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to load configuration")
	}

	log.Info().
		Str("bind_addr", cfg.BindAddr).
		Int("max_message_size", cfg.MaxMessageSize).
		Int("message_ttl_seconds", cfg.MessageTTLSeconds).
		Msg("Configuration loaded")

	// Create message hub
	h := hub.New(cfg)

	// Setup HTTP routes
	mux := http.NewServeMux()

	// WebSocket endpoint for clients
	mux.HandleFunc("/ws", h.HandleWebSocket)

	// Health check endpoint
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy","version":"` + Version + `"}`))
	})

	// Metrics endpoint (Prometheus)
	mux.Handle("/metrics", promhttp.Handler())

	// Server info endpoint
	mux.HandleFunc("/info", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{
			"name":"FortiComm Black Hole Relay",
			"version":"` + Version + `",
			"features":["websocket","ephemeral-messages","sealed-sender","federation"],
			"crypto":["x25519","ml-kem-768","dilithium3"]
		}`))
	})

	// Create HTTP server
	server := &http.Server{
		Addr:         cfg.BindAddr,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Info().Str("addr", cfg.BindAddr).Msg("🚀 Relay server listening")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal().Err(err).Msg("Server failed")
		}
	}()

	// Start message cleanup goroutine
	go h.StartCleanupRoutine()

	// Start federation listener if enabled
	if cfg.Federation.Enabled {
		go h.StartFederationListener()
	}

	// Wait for interrupt signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Info().Msg("🛑 Shutting down relay server...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Error().Err(err).Msg("Server shutdown error")
	}

	// Close hub
	h.Close()

	log.Info().Msg("✅ Relay server stopped")
}
