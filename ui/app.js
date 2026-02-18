// Import Tauri API
const { invoke } = window.__TAURI__.tauri;
const { open, save } = window.__TAURI__.dialog;
const { appDir, homeDir } = window.__TAURI__.path;
const { readBinaryFile, writeBinaryFile } = window.__TAURI__.fs;

// State
let settings = {
    modelsPath: '',
    theme: 'auto',
    language: 'en',
    useVenv: true,
    venvPath: ''
};

let backendUrl = 'http://localhost:8765';

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
    updateUI();
});

// Load settings
async function loadSettings() {
    try {
        const stored = localStorage.getItem('chatterbox-settings');
        if (stored) {
            settings = { ...settings, ...JSON.parse(stored) };
        }
        
        // Set default paths if not set
        if (!settings.modelsPath) {
            settings.modelsPath = await homeDir() + '/chatterbox-models';
        }
        if (!settings.venvPath) {
            settings.venvPath = await appDir() + '/venv';
        }
        
        saveSettings();
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save settings
function saveSettings() {
    localStorage.setItem('chatterbox-settings', JSON.stringify(settings));
    updateUI();
}

// Update UI with current settings
function updateUI() {
    document.getElementById('models-path').value = settings.modelsPath;
    document.getElementById('theme-select').value = settings.theme;
    document.getElementById('ui-language').value = settings.language;
    document.getElementById('use-venv').checked = settings.useVenv;
    document.getElementById('venv-path').value = settings.venvPath;
    
    // Show/hide language selector based on model
    const modelSelect = document.getElementById('model-select');
    const languageGroup = document.getElementById('language-group');
    languageGroup.style.display = modelSelect.value === 'multilingual' ? 'block' : 'none';
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const viewName = e.currentTarget.dataset.view;
            switchView(viewName);
        });
    });
    
    // Tag buttons
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            insertTag(e.currentTarget.dataset.tag);
        });
    });
    
    // Model selection
    document.getElementById('model-select').addEventListener('change', updateUI);
    
    // Reference audio
    document.getElementById('ref-audio-btn').addEventListener('click', async () => {
        const selected = await open({
            multiple: false,
            filters: [{
                name: 'Audio',
                extensions: ['wav', 'mp3', 'ogg', 'flac']
            }]
        });
        
        if (selected) {
            document.getElementById('ref-audio').value = selected;
            document.getElementById('ref-audio-name').textContent = selected.split('/').pop();
        }
    });
    
    // Generate button
    document.getElementById('generate-btn').addEventListener('click', generateAudio);
    
    // Save button
    document.getElementById('save-btn').addEventListener('click', saveAudio);
    
    // Sliders
    const sliders = ['temperature', 'top-p', 'top-k', 'repetition-penalty', 'min-p'];
    sliders.forEach(id => {
        const slider = document.getElementById(id);
        const valueSpan = document.getElementById(`${id}-value`);
        slider.addEventListener('input', (e) => {
            valueSpan.textContent = parseFloat(e.target.value).toFixed(2);
        });
    });
    
    // Settings
    document.getElementById('browse-models-path').addEventListener('click', async () => {
        const selected = await open({
            directory: true,
            multiple: false
        });
        
        if (selected) {
            settings.modelsPath = selected;
            saveSettings();
        }
    });
    
    document.getElementById('theme-select').addEventListener('change', (e) => {
        settings.theme = e.target.value;
        saveSettings();
    });
    
    document.getElementById('ui-language').addEventListener('change', (e) => {
        settings.language = e.target.value;
        saveSettings();
    });
    
    document.getElementById('use-venv').addEventListener('change', (e) => {
        settings.useVenv = e.target.checked;
        saveSettings();
    });
    
    document.getElementById('install-deps-btn').addEventListener('click', installDependencies);
}

// Switch between views
function switchView(viewName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');
}

// Insert tag into text
function insertTag(tag) {
    const textarea = document.getElementById('tts-text');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    let prefix = ' ';
    let suffix = ' ';
    
    if (start === 0) prefix = '';
    else if (text[start - 1] === ' ') prefix = '';
    
    if (end < text.length && text[end] === ' ') suffix = '';
    
    textarea.value = text.slice(0, start) + prefix + tag + suffix + text.slice(end);
    textarea.focus();
    textarea.setSelectionRange(start + prefix.length + tag.length + suffix.length, start + prefix.length + tag.length + suffix.length);
}

// Generate filename
function generateFilename() {
    const text = document.getElementById('tts-text').value;
    const format = document.getElementById('output-format').value;
    const model = document.getElementById('model-select').value;
    
    const date = new Date().toISOString().split('T')[0];
    const snippet = text.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const temperature = document.getElementById('temperature').value;
    
    return `${date}-${snippet}-${model}-temp${temperature}.${format}`;
}

// Show status message
function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status-message ${type}`;
    
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            status.className = 'status-message';
        }, 5000);
    }
}

// Generate audio
async function generateAudio() {
    const text = document.getElementById('tts-text').value.trim();
    if (!text) {
        showStatus('Please enter some text to synthesize', 'error');
        return;
    }
    
    const params = {
        text: text,
        model: document.getElementById('model-select').value,
        language: document.getElementById('language-select').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        top_p: parseFloat(document.getElementById('top-p').value),
        top_k: parseInt(document.getElementById('top-k').value),
        repetition_penalty: parseFloat(document.getElementById('repetition-penalty').value),
        min_p: parseFloat(document.getElementById('min-p').value),
        norm_loudness: document.getElementById('norm-loudness').checked,
        seed: parseInt(document.getElementById('seed').value),
        output_format: document.getElementById('output-format').value,
        audio_prompt_path: document.getElementById('ref-audio').value || null
    };
    
    showStatus('Generating audio...', 'info');
    document.getElementById('generate-btn').disabled = true;
    
    try {
        const response = await fetch(`${backendUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Generation failed');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const audio = document.getElementById('output-audio');
        audio.src = url;
        
        document.getElementById('output-section').style.display = 'block';
        showStatus('Audio generated successfully!', 'success');
        
        // Set default filename
        if (!document.getElementById('filename').value) {
            document.getElementById('filename').value = generateFilename();
        }
        
    } catch (error) {
        showStatus(`Error: ${error.message}`, 'error');
        console.error('Generation error:', error);
    } finally {
        document.getElementById('generate-btn').disabled = false;
    }
}

// Save audio file
async function saveAudio() {
    const audio = document.getElementById('output-audio');
    if (!audio.src) return;
    
    const defaultFilename = document.getElementById('filename').value || generateFilename();
    const format = document.getElementById('output-format').value;
    
    const savePath = await save({
        defaultPath: defaultFilename,
        filters: [{
            name: 'Audio',
            extensions: [format]
        }]
    });
    
    if (savePath) {
        try {
            // Fetch the audio blob
            const response = await fetch(audio.src);
            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Write file using Tauri
            await writeBinaryFile(savePath, uint8Array);
            
            showStatus('Audio saved successfully!', 'success');
        } catch (error) {
            showStatus(`Error saving file: ${error.message}`, 'error');
            console.error('Save error:', error);
        }
    }
}

// Install dependencies
async function installDependencies() {
    const statusEl = document.getElementById('install-status');
    statusEl.textContent = 'Installing dependencies...';
    statusEl.className = 'status-message info';
    
    try {
        const response = await fetch(`${backendUrl}/install`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error('Installation failed');
        }
        
        statusEl.textContent = 'Dependencies installed successfully!';
        statusEl.className = 'status-message success';
        
        setTimeout(() => {
            statusEl.className = 'status-message';
        }, 5000);
    } catch (error) {
        statusEl.textContent = `Error: ${error.message}`;
        statusEl.className = 'status-message error';
    }
}
