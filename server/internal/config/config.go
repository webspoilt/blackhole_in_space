// ⚙️ Configuration - Relay Server Settings

package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

// Config holds all server configuration
type Config struct {
	// Server bind address
	BindAddr string `yaml:"bind_addr"`

	// Maximum message size in bytes
	MaxMessageSize int `yaml:"max_message_size"`

	// Message TTL in seconds (how long to store undelivered messages)
	MessageTTLSeconds int `yaml:"message_ttl_seconds"`

	// TLS configuration
	TLS TLSConfig `yaml:"tls"`

	// Federation configuration
	Federation FederationConfig `yaml:"federation"`

	// Rate limiting
	RateLimit RateLimitConfig `yaml:"rate_limit"`

	// Logging
	Logging LoggingConfig `yaml:"logging"`
}

// TLSConfig holds TLS settings
type TLSConfig struct {
	Enabled    bool   `yaml:"enabled"`
	CertFile   string `yaml:"cert_file"`
	KeyFile    string `yaml:"key_file"`
	AutoCert   bool   `yaml:"auto_cert"`
}

// FederationConfig holds federation settings
type FederationConfig struct {
	Enabled      bool     `yaml:"enabled"`
	Servers      []string `yaml:"servers"`
	SharedSecret string   `yaml:"shared_secret"`
}

// RateLimitConfig holds rate limiting settings
type RateLimitConfig struct {
	Enabled           bool `yaml:"enabled"`
	MessagesPerMinute int  `yaml:"messages_per_minute"`
	ConnectionsPerIP  int  `yaml:"connections_per_ip"`
}

// LoggingConfig holds logging settings
type LoggingConfig struct {
	Level  string `yaml:"level"`
	Format string `yaml:"format"`
}

// DefaultConfig returns a default configuration
func DefaultConfig() *Config {
	return &Config{
		BindAddr:          ":8080",
		MaxMessageSize:    65536,
		MessageTTLSeconds: 86400, // 24 hours
		TLS: TLSConfig{
			Enabled:  false,
			AutoCert: false,
		},
		Federation: FederationConfig{
			Enabled: false,
			Servers: []string{},
		},
		RateLimit: RateLimitConfig{
			Enabled:           true,
			MessagesPerMinute: 60,
			ConnectionsPerIP:  10,
		},
		Logging: LoggingConfig{
			Level:  "info",
			Format: "json",
		},
	}
}

// Load loads configuration from a file
func Load(path string) (*Config, error) {
	cfg := DefaultConfig()

	// If no config file, use defaults
	if path == "" {
		return cfg, nil
	}

	// Check if file exists
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// File doesn't exist, use defaults
		return cfg, nil
	}

	// Read config file
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	// Parse YAML
	if err := yaml.Unmarshal(data, cfg); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	return cfg, nil
}

// Save saves configuration to a file
func (c *Config) Save(path string) error {
	data, err := yaml.Marshal(c)
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("failed to write config file: %w", err)
	}

	return nil
}

// Validate validates the configuration
func (c *Config) Validate() error {
	if c.BindAddr == "" {
		return fmt.Errorf("bind_addr is required")
	}

	if c.MaxMessageSize <= 0 {
		return fmt.Errorf("max_message_size must be positive")
	}

	if c.MessageTTLSeconds <= 0 {
		return fmt.Errorf("message_ttl_seconds must be positive")
	}

	if c.TLS.Enabled && !c.TLS.AutoCert {
		if c.TLS.CertFile == "" || c.TLS.KeyFile == "" {
			return fmt.Errorf("TLS cert_file and key_file are required when TLS is enabled")
		}
	}

	return nil
}
