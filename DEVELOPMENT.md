# Development Notes

## Building on macOS

This application is designed for macOS and requires macOS-specific libraries to build.

### Prerequisites

1. **Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

2. **Homebrew** (recommended):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

3. **Rust** (via rustup):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

4. **Node.js** (via Homebrew):
   ```bash
   brew install node
   ```

5. **Python 3.10+** (macOS includes Python 3, or via Homebrew):
   ```bash
   brew install python@3.11
   ```

6. **FFmpeg** (optional, for MP3/OGG support):
   ```bash
   brew install ffmpeg
   ```

### First Time Setup

1. Clone the repository
2. Run the setup script:
   ```bash
   ./scripts/setup.sh
   ```
   This creates a Python virtual environment and installs all Python dependencies.

3. Install npm dependencies:
   ```bash
   npm install
   ```

### Development Workflow

1. Start the backend server:
   ```bash
   ./scripts/run-dev.sh
   ```

2. In another terminal, start the Tauri dev app:
   ```bash
   npm run tauri:dev
   ```

### Building for Distribution

Run the build script:
```bash
./scripts/build-macos.sh
```

This will:
- Set up the Python environment if needed
- Build the Tauri application
- Create a DMG file in `src-tauri/target/release/bundle/dmg/`

### Code Signing and Notarization

For distribution outside of development, you'll need to sign and notarize the app:

1. **Get an Apple Developer account**

2. **Create a Developer ID Application certificate**

3. **Update `src-tauri/tauri.conf.json`** with your signing identity:
   ```json
   "macOS": {
     "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
   }
   ```

4. **Sign and notarize**:
   ```bash
   # Tauri can handle signing during build
   npm run tauri:build
   
   # Then notarize (requires Apple Developer credentials)
   xcrun notarytool submit src-tauri/target/release/bundle/dmg/Chatterbox_*.dmg \
     --apple-id "your@email.com" \
     --team-id "YOUR_TEAM_ID" \
     --password "app-specific-password"
   ```

## Architecture

### Frontend (ui/)
- Pure HTML/CSS/JavaScript
- Communicates with Tauri backend via `window.__TAURI__` API
- Makes HTTP requests to Python backend for TTS generation

### Tauri Layer (src-tauri/)
- Rust-based native wrapper
- Provides file system access, dialogs, etc.
- Manages application lifecycle

### Python Backend (chatterbox_backend/)
- FastAPI server running on localhost:8765
- Handles TTS model loading and generation
- Uses chatterbox-tts library

## Testing

Currently, testing focuses on:
- Syntax validation of all source files
- Manual testing of the application on macOS

To add automated tests:
1. For JavaScript: Use Jest or similar
2. For Rust: Use `cargo test`
3. For Python: Use pytest

## Known Limitations

1. **macOS Only**: This application is specifically designed for macOS and won't build on other platforms
2. **FFmpeg Required**: For MP3 and OGG output formats
3. **GPU Support**: Works best with M1/M2/M3/M4 Macs (MPS support), but also works on CPU

## Future Enhancements

- [ ] Add automated tests
- [ ] Improve error handling and user feedback
- [ ] Add progress indicators for model downloads
- [ ] Support for batch processing
- [ ] Preset management for common voice configurations
- [ ] Integration with system voice services
