// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::State;

#[derive(Default)]
struct AppState {
    backend_url: Mutex<String>,
}

#[tauri::command]
fn set_backend_url(state: State<AppState>, url: String) {
    let mut backend_url = state.backend_url.lock().unwrap();
    *backend_url = url;
}

#[tauri::command]
fn get_backend_url(state: State<AppState>) -> String {
    let backend_url = state.backend_url.lock().unwrap();
    backend_url.clone()
}

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            backend_url: Mutex::new("http://localhost:8765".to_string()),
        })
        .invoke_handler(tauri::generate_handler![
            set_backend_url,
            get_backend_url,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
