# Chatterbox macOS - Quick Start Guide

## Installation (for Users)

1. **Download** the latest DMG from the [releases page](https://github.com/cukabeka/chatterbox-mac/releases)

2. **Open the DMG** and drag Chatterbox to your Applications folder

3. **Launch Chatterbox** from Applications (or Spotlight)

4. **First Launch Setup**:
   - The app will open with a clean interface
   - Go to Settings (⚙️ icon in sidebar)
   - Click "Install/Update Dependencies" to install the required Python packages
   - Wait for installation to complete (this may take a few minutes on first run)

5. **You're ready!** Go back to the Text-to-Speech view and start generating audio

## Quick Usage

### Basic Text-to-Speech

1. **Enter your text** in the text area
2. **Select a model**:
   - **Chatterbox-Turbo** - Fastest, English only, supports paralinguistic tags
   - **Chatterbox-Multilingual** - 23+ languages
   - **Chatterbox (Standard)** - English with creative controls
3. **Choose output format**: MP3 (recommended), WAV, or OGG
4. **Click "Generate Audio"**
5. **Listen to the preview** and click "Save Audio File" to save

### Using Paralinguistic Tags (Turbo Model Only)

Add emotion and expression to your speech:

1. Click the tag buttons to insert: `[laugh]`, `[chuckle]`, `[sigh]`, etc.
2. Or type them manually in your text

Example:
```
Oh, that's hilarious! [chuckle] Um anyway, we do have a new model in store.
```

### Voice Cloning

1. Click "Choose Reference Audio..." to upload a 5-10 second audio sample
2. Generate as normal - the output will match the voice in the reference

### Advanced Parameters

Click "Advanced Parameters" to fine-tune:
- **Temperature**: Higher = more creative (0.8 default)
- **Top P**: Controls diversity (0.95 default)
- **Top K**: Limits vocabulary (1000 default)
- **Normalize Loudness**: Keeps audio at consistent volume (recommended)

## Troubleshooting

### "Backend server not available"
- Go to Settings and click "Install/Update Dependencies"
- Make sure Python 3.10+ is installed on your system

### "Audio generation failed"
- Check that your text is not empty
- For voice cloning, ensure your reference audio is a valid audio file
- Try reducing text length or adjusting parameters

### MP3/OGG export doesn't work
- Install FFmpeg: `brew install ffmpeg`
- Or use WAV format instead

## Settings

### Models Download Path
- Where TTS models are stored (default: ~/chatterbox-models)
- Models are ~350-500MB each and download automatically on first use

### Theme
- Auto: Follows system dark/light mode
- Light: Always light theme
- Dark: Always dark theme

### Virtual Environment
- Keep "Use isolated virtual environment" enabled (recommended)
- This ensures clean Python dependencies separate from your system

## Tips

- **First generation is slow**: Models need to download and load (1-2 minutes)
- **Subsequent generations are fast**: Models stay in memory
- **Use descriptive filenames**: The app auto-generates names, but you can customize
- **Experiment with parameters**: Temperature and top-p have the biggest impact on style
- **Reference audio quality matters**: Use clear, clean audio samples for best voice cloning

## System Requirements

- macOS 10.15 (Catalina) or later
- 8GB RAM minimum (16GB recommended for multilingual model)
- 5GB free disk space for models and app
- Internet connection (for model downloads)

## Getting Help

- **Documentation**: See README-MACOS.md for detailed information
- **Issues**: Report bugs at https://github.com/cukabeka/chatterbox-mac/issues
- **Original Chatterbox**: https://github.com/resemble-ai/chatterbox

## What's Next?

Try experimenting with:
- Different voices using reference audio
- Paralinguistic tags for emotional speech
- Multilingual generation in various languages
- Fine-tuning parameters for different speaking styles

Enjoy creating natural-sounding speech with Chatterbox! 🎙️
