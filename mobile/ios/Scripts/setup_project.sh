#!/bin/bash

# setup_project.sh
# Initial project setup script

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "🚀 Setting up VAULT iOS project..."

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode is not installed"
    exit 1
fi

if ! command -v swift &> /dev/null; then
    echo "❌ Swift is not installed"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install from https://rustup.rs/"
    exit 1
fi

echo "✅ All prerequisites met"

# Clone vault repository if needed
if [ ! -d "${PROJECT_ROOT}/../vault" ]; then
    echo "📥 Cloning VAULT repository..."
    cd "${PROJECT_ROOT}/.."
    git clone https://github.com/webspoilt/vault.git
fi

# Build Rust crypto core
echo "🔨 Building Rust crypto core..."
bash "${PROJECT_ROOT}/Scripts/build_rust_crypto.sh"

# Install Swift dependencies
echo "📦 Installing Swift dependencies..."
cd "${PROJECT_ROOT}"
swift package resolve

# Create required directories
echo "📁 Creating required directories..."
mkdir -p "${PROJECT_ROOT}/VaultMessenger/Resources/Certificates"
mkdir -p "${PROJECT_ROOT}/Build"
mkdir -p "${PROJECT_ROOT}/DerivedData"

# Set executable permissions
chmod +x "${PROJECT_ROOT}/Scripts"/*.sh

echo "✅ Project setup complete!"
echo ""
echo "Next steps:"
echo "1. Open VaultMessenger.xcodeproj in Xcode"
echo "2. Select your development team in Signing & Capabilities"
echo "3. Build and run on your device or simulator"
echo ""
echo "⚠️  Note: You'll need to configure your backend server URL in Info.plist"
