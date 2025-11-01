// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod fs_commands;
mod watcher;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      fs_commands::read_markdown_file,
      fs_commands::write_markdown_file,
      fs_commands::select_markdown_file,
      watcher::start_watching_file
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
