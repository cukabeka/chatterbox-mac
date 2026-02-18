# Chatterbox macOS Native Application

Native macOS frontend for Chatterbox TTS using Tauri.

## Features

- 🎙️ **Native macOS Experience**: Built with Tauri for a lightweight, fast, and native-feeling application
- 🗣️ **Multiple TTS Models**: Support for Chatterbox-Turbo, Chatterbox-Multilingual, and standard Chatterbox
- 🌍 **Multilingual Support**: 23+ languages with the Multilingual model
- 🎛️ **Advanced Controls**: Fine-tune generation with sliders for temperature, top-p, top-k, and more
- 🎭 **Paralinguistic Tags**: Add emotion and expression with tags like [laugh], [chuckle], [sigh]
- 🔊 **Multiple Output Formats**: Generate audio in MP3, WAV, or OGG formats
- 🎨 **Modern UI**: Clean, macOS-native interface with light/dark mode support
- ⚙️ **Flexible Settings**: Configure model paths, themes, and Python environment
- 🔒 **Isolated Environment**: Uses Python virtual environment for clean dependency management

## System Requirements

- macOS 10.15 (Catalina) or later
- Python 3.10 or later
- Node.js 16 or later (for development/building)
- Rust toolchain (for building from source)
- FFmpeg (optional, for MP3/OGG output)

## Installation

### Pre-built Application

1. Download the latest DMG from the releases page
2. Open the DMG and drag Chatterbox to your Applications folder
3. Launch Chatterbox from Applications
4. On first launch, go to Settings and click "Install/Update Dependencies"

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/cukabeka/chatterbox-mac.git
   cd chatterbox-mac
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the setup script:
   ```bash
   ./scripts/setup.sh
   ```

4. Build the application:
   ```bash
   ./scripts/build-macos.sh
   ```

The built application will be in `src-tauri/target/release/bundle/dmg/`.

## Development

### Running in Development Mode

1. Start the Python backend:
   ```bash
   ./scripts/run-dev.sh
   ```

2. In another terminal, start the Tauri dev server:
   ```bash
   npm run tauri:dev
   ```

### Project Structure

```
chatterbox-mac/
├── ui/                     # Frontend HTML/CSS/JS
│   ├── index.html         # Main UI
│   ├── styles.css         # Styling
│   └── app.js             # Application logic
├── src-tauri/             # Rust/Tauri backend
│   ├── src/               # Rust source
│   ├── icons/             # Application icons
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── chatterbox_backend/    # Python backend server
│   ├── server.py          # FastAPI server
│   └── requirements.txt   # Python dependencies
├── scripts/               # Build and utility scripts
│   ├── setup.sh          # Setup Python environment
│   ├── build-macos.sh    # Build macOS app
│   └── run-dev.sh        # Run development server
└── src/chatterbox/        # Chatterbox TTS library
```

## Usage

### Text-to-Speech Generation

1. Enter your text in the text area
2. Optionally, click tag buttons to insert paralinguistic tags (Turbo model only)
3. Select a model (Turbo recommended for best performance)
4. Choose output format (MP3, WAV, or OGG)
5. Optionally upload a reference audio file for voice cloning
6. Click "Generate Audio" to create the speech
7. Listen to the preview and click "Save Audio File" to save

### Advanced Parameters

Open the "Advanced Parameters" section to fine-tune:

- **Temperature**: Controls randomness (0.05-2.0, default: 0.8)
- **Top P**: Nucleus sampling threshold (0.0-1.0, default: 0.95)
- **Top K**: Number of top tokens to consider (0-1000, default: 1000)
- **Repetition Penalty**: Penalizes repeated tokens (1.0-2.0, default: 1.2)
- **Min P**: Minimum probability threshold (0.0-1.0, default: 0.0)
- **Normalize Loudness**: Normalize output to -27 LUFS
- **Random Seed**: Set to non-zero for reproducible results

### Settings

- **Models Download Path**: Where TTS models are downloaded and cached
- **Theme**: Choose Auto (system), Light, or Dark mode
- **UI Language**: Interface language
- **Virtual Environment**: Uses isolated Python environment (recommended)

## Technical Details

### Architecture

The application uses a hybrid architecture:

1. **Frontend**: HTML/CSS/JavaScript UI running in Tauri's webview
2. **Tauri Layer**: Rust-based native wrapper providing system integration
3. **Backend Server**: Python FastAPI server handling TTS generation
4. **Python Environment**: Isolated virtual environment for clean dependency management

### Why Virtual Environment?

The app uses Python's venv (virtual environment) instead of system Python or Docker because:

- ✅ Lightweight and fast
- ✅ No Docker daemon required
- ✅ Isolated from system Python
- ✅ Easy to manage and update
- ✅ Works seamlessly with macOS

### Model Downloads

Models are automatically downloaded on first use and cached locally. The default cache location is `~/chatterbox-models`, but this can be changed in Settings.

Model sizes:
- Chatterbox-Turbo: ~350M parameters
- Chatterbox-Multilingual: ~500M parameters  
- Chatterbox (Standard): ~500M parameters

## Audio Format Support

- **WAV**: Lossless, largest file size, best quality
- **MP3**: Compressed, good quality, smaller file size (requires FFmpeg)
- **OGG**: Compressed, good quality, open format (requires FFmpeg)

To enable MP3/OGG support, install FFmpeg:
```bash
brew install ffmpeg
```

## Troubleshooting

### Backend Server Not Starting

If the backend server fails to start:

1. Check that Python 3.10+ is installed: `python3 --version`
2. Ensure dependencies are installed: `./scripts/setup.sh`
3. Try running the server manually:
   ```bash
   source venv/bin/activate
   python -m chatterbox_backend.server
   ```

### Model Download Issues

If models fail to download:

1. Check your internet connection
2. Ensure you have sufficient disk space
3. Check the models path in Settings is writable
4. Try manually downloading models using the Python examples

### Audio Generation Fails

If audio generation fails:

1. Check that the backend server is running
2. Verify your text input is not empty
3. For voice cloning, ensure reference audio is a valid audio file
4. Check console logs for detailed error messages

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

See [LICENSE](LICENSE) for details.

## Acknowledgements

- [Resemble AI](https://resemble.ai) for Chatterbox TTS
- [Tauri](https://tauri.app) for the application framework
- All the open-source projects that make this possible

## Contact

For issues and questions, please open an issue on GitHub.
