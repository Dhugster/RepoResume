// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    WindowEvent,
};
use std::process::{Command, Child};
use std::sync::Mutex;

struct AppState {
    backend_process: Mutex<Option<Child>>,
}

fn main() {
    // System tray menu
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let show = CustomMenuItem::new("show".to_string(), "Show Window");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide to Tray");
    let analyze = CustomMenuItem::new("analyze".to_string(), "Analyze Repositories");
    
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(analyze)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .manage(AppState {
            backend_process: Mutex::new(None),
        })
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                "hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "analyze" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                    // Emit event to frontend to trigger analysis
                    window.emit("trigger-analyze", {}).unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            WindowEvent::CloseRequested { api, .. } => {
                // Prevent window from closing, just hide it instead
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            start_backend,
            stop_backend,
            check_backend_status,
            minimize_to_tray
        ])
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            
            // Show window initially (user can minimize to tray if desired)
            window.show().unwrap();
            window.set_focus().unwrap();
            
            // Enable devtools in development
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
            }
            
            println!("RepoResume Desktop starting...");
            println!("Window visible: {}", window.is_visible().unwrap());
            
            // Start the backend server
            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                println!("Starting backend server...");
                if let Err(e) = start_backend_server(app_handle).await {
                    eprintln!("Failed to start backend: {}", e);
                    eprintln!("Note: You can start the backend manually with: cd backend && npm start");
                }
            });
            
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn start_backend() -> Result<String, String> {
    // Backend will be started automatically on app launch
    Ok("Backend starting...".to_string())
}

#[tauri::command]
async fn stop_backend(state: tauri::State<'_, AppState>) -> Result<String, String> {
    let mut process = state.backend_process.lock().unwrap();
    if let Some(mut child) = process.take() {
        child.kill().map_err(|e| e.to_string())?;
        Ok("Backend stopped".to_string())
    } else {
        Err("Backend not running".to_string())
    }
}

#[tauri::command]
async fn check_backend_status() -> Result<bool, String> {
    // Check if backend is responding
    match reqwest::get("http://localhost:3001/health").await {
        Ok(response) => Ok(response.status().is_success()),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn minimize_to_tray(window: tauri::Window) -> Result<(), String> {
    window.hide().map_err(|e| e.to_string())
}

async fn start_backend_server(app: tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // Check if backend is already running
    if reqwest::get("http://localhost:3001/health").await.is_ok() {
        println!("Backend is already running!");
        return Ok(());
    }
    
    // Try to find Node.js
    #[cfg(target_os = "windows")]
    let node_cmd = "node.exe";
    #[cfg(not(target_os = "windows"))]
    let node_cmd = "node";
    
    // Try to find backend relative to executable
    let exe_path = std::env::current_exe()?;
    let exe_dir = exe_path.parent().unwrap();
    
    // Look for backend in common locations
    let backend_paths = vec![
        exe_dir.join("../../backend/src/index.js"),  // If running from target/release
        exe_dir.join("../backend/src/index.js"),      // If bundled
        exe_dir.join("backend/src/index.js"),          // If in same directory
    ];
    
    let mut backend_found = false;
    let mut backend_dir = exe_dir.to_path_buf();
    
    for backend_path in &backend_paths {
        if backend_path.exists() {
            backend_dir = backend_path.parent().unwrap().parent().unwrap().to_path_buf();
            backend_found = true;
            println!("Found backend at: {:?}", backend_path);
            break;
        }
    }
    
    if !backend_found {
        eprintln!("Warning: Backend not found. App will try to connect to existing server.");
        return Ok(()); // Don't fail, just try to connect
    }
    
    // Start Node.js backend process
    let child = Command::new(node_cmd)
        .current_dir(&backend_dir)
        .arg("backend/src/index.js")
        .env("NODE_ENV", "production")
        .env("PORT", "3001")
        .env("FRONTEND_URL", "http://localhost:3001")
        .spawn();
    
    match child {
        Ok(process) => {
            // Store process handle
            if let Some(state) = app.try_state::<AppState>() {
                *state.backend_process.lock().unwrap() = Some(process);
            }
            
            // Wait for backend to be ready
            println!("Waiting for backend to start...");
            for i in 0..30 {
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                if reqwest::get("http://localhost:3001/health").await.is_ok() {
                    println!("Backend is ready!");
                    return Ok(());
                }
                if i % 5 == 0 {
                    println!("Still waiting for backend... ({}/30)", i);
                }
            }
            
            eprintln!("Warning: Backend did not start within 30 seconds");
            Ok(())
        }
        Err(e) => {
            eprintln!("Failed to start backend: {}. App will try to connect to existing server.", e);
            Ok(()) // Don't fail, user might have backend running separately
        }
    }
}


