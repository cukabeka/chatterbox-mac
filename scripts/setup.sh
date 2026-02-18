#!/bin/bash
# Setup script for Chatterbox macOS app
# This script creates a virtual environment and installs all dependencies

set -e

echo "🚀 Setting up Chatterbox for macOS..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install Chatterbox TTS
echo "📥 Installing Chatterbox TTS..."
pip install -e .

# Install backend dependencies
echo "📥 Installing backend server dependencies..."
pip install -r chatterbox_backend/requirements.txt

# Install ffmpeg if not present (for audio format conversion)
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg not found. Audio format conversion (MP3/OGG) may not work."
    echo "   Please install ffmpeg using: brew install ffmpeg"
else
    echo "✅ FFmpeg found"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the backend server manually:"
echo "  source venv/bin/activate"
echo "  python -m chatterbox_backend.server"
echo ""
