#!/bin/bash

# build_rust_crypto.sh
# Build Rust crypto core for iOS targets

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUST_CORE_PATH="${PROJECT_ROOT}/../vault/core"
OUTPUT_PATH="${PROJECT_ROOT}/Frameworks"

echo "🔨 Building Rust crypto core for iOS..."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install from https://rustup.rs/"
    exit 1
fi

# Add iOS targets
rustup target add aarch64-apple-ios
rustup target add aarch64-apple-ios-sim
rustup target add x86_64-apple-ios

# Install cargo-lipo for universal binaries
cargo install cargo-lipo

cd "${RUST_CORE_PATH}" || exit 1

# Build for iOS devices (arm64)
echo "📱 Building for iOS devices (arm64)..."
cargo build --release --target aarch64-apple-ios

# Build for iOS simulator (arm64)
echo "🖥️  Building for iOS simulator (arm64)..."
cargo build --release --target aarch64-apple-ios-sim

# Build for iOS simulator (x86_64)
echo "🖥️  Building for iOS simulator (x86_64)..."
cargo build --release --target x86_64-apple-ios

# Create XCFramework
echo "📦 Creating XCFramework..."
mkdir -p "${OUTPUT_PATH}"

xcodebuild -create-xcframework \
    -library "${RUST_CORE_PATH}/target/aarch64-apple-ios/release/libvault_crypto.a" \
    -headers "${PROJECT_ROOT}/VaultMessenger/Bridge/Headers" \
    -library "${RUST_CORE_PATH}/target/aarch64-apple-ios-sim/release/libvault_crypto.a" \
    -headers "${PROJECT_ROOT}/VaultMessenger/Bridge/Headers" \
    -library "${RUST_CORE_PATH}/target/x86_64-apple-ios/release/libvault_crypto.a" \
    -headers "${PROJECT_ROOT}/VaultMessenger/Bridge/Headers" \
    -output "${OUTPUT_PATH}/VaultCrypto.xcframework"

echo "✅ Rust crypto library built successfully!"
echo "📍 XCFramework location: ${OUTPUT_PATH}/VaultCrypto.xcframework"
