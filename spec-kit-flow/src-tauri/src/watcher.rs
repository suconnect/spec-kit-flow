use notify::{Watcher, RecursiveMode, Event, EventKind};
use tauri::{AppHandle, Manager};
use std::sync::mpsc::channel;
use std::path::Path;
use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct FileChangePayload {
    pub path: String,
    pub kind: String,
    pub timestamp: u64,
}

pub fn start_file_watcher(app_handle: AppHandle, file_path: String) -> notify::Result<()> {
    let (tx, rx) = channel();
    
    let mut watcher = notify::recommended_watcher(move |res: notify::Result<Event>| {
        if let Ok(event) = res {
            let _ = tx.send(event);
        }
    })?;
    
    watcher.watch(Path::new(&file_path), RecursiveMode::NonRecursive)?;
    
    std::thread::spawn(move || {
        for event in rx {
            let kind_str = match event.kind {
                EventKind::Create(_) => "create",
                EventKind::Modify(_) => "modify",
                EventKind::Remove(_) => "remove",
                _ => "other",
            };
            
            for path in event.paths {
                let payload = FileChangePayload {
                    path: path.to_string_lossy().to_string(),
                    kind: kind_str.to_string(),
                    timestamp: std::time::SystemTime::now()
                        .duration_since(std::time::UNIX_EPOCH)
                        .unwrap()
                        .as_millis() as u64,
                };
                
                let _ = app_handle.emit_all("file-changed", payload);
            }
        }
    });
    
    // Keep watcher alive
    std::mem::forget(watcher);
    
    Ok(())
}

#[tauri::command]
pub fn start_watching_file(app_handle: AppHandle, file_path: String) -> Result<(), String> {
    start_file_watcher(app_handle, file_path)
        .map_err(|e| format!("Failed to start file watcher: {}", e))
}
