"""
Chatterbox Backend Server
FastAPI server for handling TTS generation requests from the Tauri frontend
"""
import os
import sys
import io
import tempfile
from pathlib import Path
from typing import Optional
import torch
import torchaudio as ta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn

# Add parent directory to path to import chatterbox
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from chatterbox.tts import ChatterboxTTS
from chatterbox.tts_turbo import ChatterboxTurboTTS
from chatterbox.mtl_tts import ChatterboxMultilingualTTS


app = FastAPI(title="Chatterbox Backend")

# Enable CORS for Tauri frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tauri apps
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GenerateRequest(BaseModel):
    text: str
    model: str = "turbo"
    language: Optional[str] = "en"
    temperature: float = 0.8
    top_p: float = 0.95
    top_k: int = 1000
    repetition_penalty: float = 1.2
    min_p: float = 0.0
    norm_loudness: bool = True
    seed: int = 0
    output_format: str = "mp3"
    audio_prompt_path: Optional[str] = None
    # For non-turbo models
    exaggeration: Optional[float] = None
    cfg_weight: Optional[float] = None


# Model cache
models = {}


def get_device():
    """Detect the best available device"""
    if torch.cuda.is_available():
        return "cuda"
    elif torch.backends.mps.is_available():
        return "mps"
    else:
        return "cpu"


def load_model(model_name: str):
    """Load a TTS model, caching it for reuse"""
    if model_name in models:
        return models[model_name]
    
    device = get_device()
    print(f"Loading {model_name} model on {device}...")
    
    # Apply MPS patch for Mac if needed
    if device == "mps":
        map_location = torch.device(device)
        torch_load_original = torch.load
        def patched_torch_load(*args, **kwargs):
            if 'map_location' not in kwargs:
                kwargs['map_location'] = map_location
            return torch_load_original(*args, **kwargs)
        torch.load = patched_torch_load
    
    if model_name == "turbo":
        model = ChatterboxTurboTTS.from_pretrained(device=device)
    elif model_name == "multilingual":
        model = ChatterboxMultilingualTTS.from_pretrained(device=device)
    elif model_name == "standard":
        model = ChatterboxTTS.from_pretrained(device=device)
    else:
        raise ValueError(f"Unknown model: {model_name}")
    
    models[model_name] = model
    return model


def set_seed(seed: int):
    """Set random seed for reproducibility"""
    import random
    import numpy as np
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
    random.seed(seed)
    np.random.seed(seed)


def convert_audio_format(wav_tensor, sample_rate: int, output_format: str) -> bytes:
    """Convert audio tensor to desired format"""
    # Save to temporary file
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp_wav:
        tmp_wav_path = tmp_wav.name
        ta.save(tmp_wav_path, wav_tensor, sample_rate)
    
    try:
        if output_format == "wav":
            with open(tmp_wav_path, 'rb') as f:
                return f.read()
        
        # Convert to MP3 or OGG using ffmpeg
        with tempfile.NamedTemporaryFile(suffix=f'.{output_format}', delete=False) as tmp_out:
            tmp_out_path = tmp_out.name
        
        import subprocess
        cmd = ['ffmpeg', '-i', tmp_wav_path, '-y']
        
        if output_format == "mp3":
            cmd.extend(['-codec:a', 'libmp3lame', '-qscale:a', '2'])
        elif output_format == "ogg":
            cmd.extend(['-codec:a', 'libvorbis', '-qscale:a', '5'])
        
        cmd.append(tmp_out_path)
        
        subprocess.run(cmd, check=True, capture_output=True)
        
        with open(tmp_out_path, 'rb') as f:
            result = f.read()
        
        os.unlink(tmp_out_path)
        return result
    
    finally:
        os.unlink(tmp_wav_path)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Chatterbox Backend Server"}


@app.get("/models")
async def list_models():
    """List available models"""
    return {
        "models": [
            {
                "id": "turbo",
                "name": "Chatterbox-Turbo",
                "languages": ["en"],
                "features": ["paralinguistic_tags"]
            },
            {
                "id": "multilingual",
                "name": "Chatterbox-Multilingual",
                "languages": ["ar", "da", "de", "el", "en", "es", "fi", "fr", "he", "hi", 
                             "it", "ja", "ko", "ms", "nl", "no", "pl", "pt", "ru", "sv", 
                             "sw", "tr", "zh"],
                "features": ["voice_cloning"]
            },
            {
                "id": "standard",
                "name": "Chatterbox",
                "languages": ["en"],
                "features": ["cfg", "exaggeration"]
            }
        ]
    }


@app.post("/generate")
async def generate_audio(request: GenerateRequest):
    """Generate TTS audio"""
    try:
        # Load model
        model = load_model(request.model)
        
        # Set seed if specified
        if request.seed > 0:
            set_seed(request.seed)
        
        # Prepare generation parameters
        gen_params = {
            "text": request.text,
        }
        
        if request.audio_prompt_path:
            gen_params["audio_prompt_path"] = request.audio_prompt_path
        
        # Add model-specific parameters
        if request.model == "turbo":
            gen_params.update({
                "temperature": request.temperature,
                "top_p": request.top_p,
                "top_k": request.top_k,
                "repetition_penalty": request.repetition_penalty,
                "min_p": request.min_p,
                "norm_loudness": request.norm_loudness,
            })
        elif request.model == "multilingual":
            gen_params["language_id"] = request.language
            if request.exaggeration is not None:
                gen_params["exaggeration"] = request.exaggeration
            if request.cfg_weight is not None:
                gen_params["cfg_weight"] = request.cfg_weight
        elif request.model == "standard":
            if request.exaggeration is not None:
                gen_params["exaggeration"] = request.exaggeration
            if request.cfg_weight is not None:
                gen_params["cfg_weight"] = request.cfg_weight
        
        # Generate audio
        print(f"Generating audio with params: {gen_params}")
        wav = model.generate(**gen_params)
        
        # Convert to desired format
        audio_data = convert_audio_format(wav, model.sr, request.output_format)
        
        # Determine MIME type
        mime_types = {
            "mp3": "audio/mpeg",
            "wav": "audio/wav",
            "ogg": "audio/ogg"
        }
        mime_type = mime_types.get(request.output_format, "audio/wav")
        
        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type=mime_type,
            headers={
                "Content-Disposition": f"attachment; filename=output.{request.output_format}"
            }
        )
    
    except Exception as e:
        print(f"Error generating audio: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/install")
async def install_dependencies():
    """Install/update Chatterbox dependencies"""
    try:
        import subprocess
        
        # Install chatterbox-tts package
        subprocess.run(
            [sys.executable, "-m", "pip", "install", "-e", "."],
            check=True,
            capture_output=True
        )
        
        return {"status": "ok", "message": "Dependencies installed successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def main():
    """Run the server"""
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8765,
        log_level="info"
    )


if __name__ == "__main__":
    main()
