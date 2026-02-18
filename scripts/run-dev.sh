#!/bin/bash
# Development script for Chatterbox
# Runs the Python backend and opens the UI in development mode

set -e

echo "🚀 Starting Chatterbox in development mode..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Running setup..."
    ./scripts/setup.sh
fi

# Activate virtual environment
source venv/bin/activate

# Start the backend server in the background
echo "🔧 Starting backend server..."
python -m chatterbox_backend.server &
BACKEND_PID=$!

# Give the server a moment to start
sleep 2

echo "✅ Backend server started (PID: $BACKEND_PID)"
echo "🌐 Backend running at http://localhost:8765"
echo ""
echo "To run the Tauri dev app (in another terminal):"
echo "  npm run tauri dev"
echo ""
echo "Press Ctrl+C to stop the backend server"

# Wait for Ctrl+C
trap "echo ''; echo 'Stopping backend server...'; kill $BACKEND_PID 2>/dev/null; exit 0" INT
wait $BACKEND_PID
