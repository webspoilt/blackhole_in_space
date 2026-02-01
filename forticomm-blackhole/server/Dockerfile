# 🕳️ FortiComm Black Hole Relay Server Dockerfile

# Build stage
FROM golang:1.21-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git ca-certificates

# Set working directory
WORKDIR /build

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags='-w -s -extldflags "-static"' \
    -a -installsuffix cgo \
    -o blackhole-relay \
    ./cmd/relay

# Final stage
FROM scratch

# Copy CA certificates for TLS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy binary
COPY --from=builder /build/blackhole-relay /app/blackhole-relay

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 8080

# Run the binary
ENTRYPOINT ["/app/blackhole-relay"]
CMD ["-config", "/app/config.yaml"]
