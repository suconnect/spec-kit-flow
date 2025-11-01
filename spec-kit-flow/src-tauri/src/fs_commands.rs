use std::fs;
use tauri::command;

#[command]
pub fn read_markdown_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file {}: {}", path, e))
}

#[command]
pub fn write_markdown_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file {}: {}", path, e))
}

#[command]
pub async fn select_markdown_file() -> Result<Option<String>, String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    
    let file_path = FileDialogBuilder::new()
        .add_filter("Markdown", &["md"])
        .set_title("Select Markdown File")
        .pick_file();
    
    Ok(file_path.and_then(|path| path.to_str().map(|s| s.to_string())))
}
