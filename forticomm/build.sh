#!/bin/bash
# FortiComm Build Script
# Complete build and deployment script

set -e

echo "🚀 Building FortiComm - World's Most Secure Messaging Platform"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check dependencies
echo ""
echo "📋 Checking dependencies..."

# Check Rust
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    print_status "Rust: $RUST_VERSION"
else
    print_error "Rust not found. Please install Rust: https://rustup.rs/"
    exit 1
fi

# Check Go
if command -v go &> /dev/null; then
    GO_VERSION=$(go version)
    print_status "Go: $GO_VERSION"
else
    print_error "Go not found. Please install Go: https://golang.org/dl/"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js: https://nodejs.org/"
    exit 1
fi

# Check Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_status "Docker: $DOCKER_VERSION"
else
    print_warning "Docker not found. Skipping Docker build."
fi

# Step 1: Build Rust cryptographic core
echo ""
echo "🔐 Step 1: Building Rust cryptographic core..."
cd core

# Install wasm32 target if not present
rustup target add wasm32-unknown-unknown 2>/dev/null || true

# Build for WASM
print_status "Compiling to WebAssembly..."
cargo build --release --target wasm32-unknown-unknown

# Copy WASM to web public directory
mkdir -p ../web/public
cp target/wasm32-unknown-unknown/release/forticomm_core.wasm ../web/public/crypto-core.wasm

# Generate SRI hash for the WASM file
if command -v openssl &> /dev/null; then
    WASM_HASH=$(openssl dgst -sha384 -binary ../web/public/crypto-core.wasm | openssl base64 -A)
    print_status "WASM SRI hash: sha384-$WASM_HASH"
    
    # Update index.html with SRI hash
    sed -i.bak "s|WASM_HASH_PLACEHOLDER|sha384-$WASM_HASH|g" ../web/public/index.html
    rm ../web/public/index.html.bak
fi

print_status "Cryptographic core built successfully"
cd ..

# Step 2: Build Go relay server
echo ""
echo "🖥️  Step 2: Building Go relay server..."
cd server

# Download dependencies
print_status "Downloading Go dependencies..."
go mod download

# Build the server
print_status "Compiling relay server..."
CGO_ENABLED=0 GOOS=linux go build -o forticomm-relay ./cmd/relay/main.go

print_status "Relay server built successfully"
cd ..

# Step 3: Build web client
echo ""
echo "🌐 Step 3: Building web client..."
cd web

# Install dependencies
print_status "Installing npm dependencies..."
npm ci

# Build the application
print_status "Building React application..."
npm run build

print_status "Web client built successfully"
cd ..

# Step 4: Build Docker images (if Docker is available)
if command -v docker &> /dev/null; then
    echo ""
    echo "🐳 Step 4: Building Docker images..."
    
    # Build relay server image
    print_status "Building relay server image..."
    docker build -t forticomm/relay:latest ./server
    
    # Build web client image
    print_status "Building web client image..."
    docker build -t forticomm/web:latest ./web
    
    print_status "Docker images built successfully"
fi

# Step 5: Run security checks
echo ""
echo "🔒 Step 5: Running security checks..."

# Check for hardcoded secrets
if grep -r "password\|secret\|key" --include="*.go" --include="*.rs" --include="*.ts" . 2>/dev/null | grep -v "\.git\|node_modules\|target" | head -5; then
    print_warning "Potential hardcoded secrets found. Please review."
else
    print_status "No obvious hardcoded secrets found"
fi

# Run cargo audit if available
if command -v cargo-audit &> /dev/null; then
    cd core
    cargo audit
    cd ..
else
    print_warning "cargo-audit not installed. Skipping Rust security audit."
fi

# Step 6: Generate documentation
echo ""
echo "📚 Step 6: Generating documentation..."

cd core
cargo doc --no-deps 2>/dev/null || true
cd ..

cd server
go doc ./... 2>/dev/null || true
cd ..

print_status "Documentation generated"

# Summary
echo ""
echo "=============================================================="
echo "✅ Build Complete!"
echo "=============================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Deploy with Docker Compose:"
echo "   docker-compose up -d"
echo ""
echo "2. Access the application:"
echo "   Web Interface: https://localhost:3000"
echo "   API Endpoint:  https://localhost:8080"
echo "   Metrics:       https://localhost:9090"
echo ""
echo "3. Run tests:"
echo "   cd core && cargo test"
echo "   cd server && go test ./..."
echo "   cd web && npm test"
echo ""
echo "4. For production deployment:"
echo "   - Set strong passwords in .env file"
echo "   - Configure TLS certificates"
echo "   - Set up monitoring and alerting"
echo "   - Review security settings"
echo ""
echo "🛡️  FortiComm - Secure messaging. Zero compromise."
echo ""
