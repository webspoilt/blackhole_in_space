#!/bin/bash

# VAULT Messenger - Linux Installation Script
# This script automates the installation process

set -e

echo "=========================================="
echo "  VAULT Messenger - Installation Script  "
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}ERROR: Please do not run this script as root${NC}"
   exit 1
fi

# Detect Linux distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo -e "${RED}Cannot detect Linux distribution${NC}"
    exit 1
fi

echo -e "${GREEN}Detected OS: $PRETTY_NAME${NC}"
echo ""

# Install system dependencies
echo "Installing system dependencies..."

case "$OS" in
    ubuntu|debian)
        sudo apt update
        sudo apt install -y nodejs npm git build-essential libsecret-1-dev
        ;;
    fedora)
        sudo dnf install -y nodejs npm git gcc-c++ make libsecret-devel
        ;;
    arch|manjaro)
        sudo pacman -S --noconfirm nodejs npm git base-devel libsecret
        ;;
    *)
        echo -e "${YELLOW}WARNING: Unknown distribution. Please install dependencies manually:${NC}"
        echo "  - Node.js 18+"
        echo "  - npm"
        echo "  - git"
        echo "  - build-essential (gcc, g++, make)"
        echo "  - libsecret-dev"
        echo ""
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        ;;
esac

echo -e "${GREEN}✓ System dependencies installed${NC}"
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}ERROR: Node.js 18 or higher is required${NC}"
    echo "Current version: $(node -v)"
    echo "Please update Node.js: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
echo ""

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}ERROR: Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Please edit .env file and add your API keys${NC}"
    echo ""
fi

# Build application
echo "Building application..."
read -p "Do you want to build the application now? (Y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
    npm run build:linux
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Application built successfully${NC}"
        echo ""
        echo "Installation complete! You can now:"
        echo ""
        echo "1. Run in development mode:"
        echo "   npm start"
        echo ""
        echo "2. Install the built package:"
        if [ -f dist/*.deb ]; then
            echo "   sudo dpkg -i dist/*.deb"
        fi
        if [ -f dist/*.AppImage ]; then
            echo "   chmod +x dist/*.AppImage"
            echo "   ./dist/*.AppImage"
        fi
    else
        echo -e "${RED}ERROR: Build failed${NC}"
        echo "You can still run in development mode: npm start"
    fi
else
    echo ""
    echo "Skipping build. You can run in development mode:"
    echo "   npm start"
fi

echo ""
echo "=========================================="
echo "  Installation Complete!                 "
echo "=========================================="
echo ""
echo -e "${YELLOW}IMPORTANT: Don't forget to configure your email service in .env${NC}"
echo ""
echo "For help, see:"
echo "  - README.md for full documentation"
echo "  - QUICKSTART.md for quick start guide"
echo "  - DEPLOYMENT.md for deployment options"
echo ""
echo -e "${GREEN}Enjoy secure messaging with VAULT!${NC}"
echo ""
