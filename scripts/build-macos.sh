#!/bin/bash
# Build script for Chatterbox macOS app
# This script builds the Tauri application and creates a DMG for distribution

set -e

echo "🔨 Building Chatterbox for macOS..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed. Please install Rust from https://rustup.rs/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
fi

# Run setup script to prepare Python environment
if [ ! -d "venv" ]; then
    echo "📦 Running setup script..."
    ./scripts/setup.sh
fi

# Build the Tauri app
echo "🔨 Building Tauri application..."
npm run tauri build

echo ""
echo "✅ Build complete!"
echo ""
echo "The application bundle can be found in:"
echo "  src-tauri/target/release/bundle/"
echo ""
echo "To create a DMG for distribution, the .app bundle and DMG are in:"
echo "  src-tauri/target/release/bundle/dmg/"
echo ""
