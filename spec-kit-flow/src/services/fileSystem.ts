import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

export interface FileChangeEvent {
  path: string;
  kind: 'create' | 'modify' | 'remove' | 'other';
  timestamp: number;
}

export interface FileSystemService {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  selectFile(): Promise<string | null>;
  watchFile(path: string, callback: (event: FileChangeEvent) => void): Promise<() => void>;
}

// ??????????????
let isInternalSave = false;
let internalSaveTimer: NodeJS.Timeout | null = null;

class TauriFileSystemService implements FileSystemService {
  async readFile(path: string): Promise<string> {
    return invoke<string>('read_markdown_file', { path });
  }

  async writeFile(path: string, content: string): Promise<void> {
    // ????????
    isInternalSave = true;
    
    // ???????
    if (internalSaveTimer) {
      clearTimeout(internalSaveTimer);
    }
    
    // ????
    await invoke<void>('write_markdown_file', { path, content });
    
    // 1 ??????
    internalSaveTimer = setTimeout(() => {
      isInternalSave = false;
      internalSaveTimer = null;
    }, 1000);
  }

  async selectFile(): Promise<string | null> {
    return invoke<string | null>('select_markdown_file');
  }

  async watchFile(
    path: string,
    callback: (event: FileChangeEvent) => void
  ): Promise<() => void> {
    // ??????
    await invoke<void>('start_watching_file', { filePath: path });
    
    // ????????
    const unlisten = await listen<FileChangeEvent>('file-changed', (event) => {
      // ????????????
      if (isInternalSave) {
        console.log('[FileSystem] Internal save detected, skipping reload');
        return;
      }
      
      console.log('[FileSystem] External modification detected:', event.payload);
      callback(event.payload);
    });
    
    return unlisten;
  }

  // ?????????
  isInternalSave(): boolean {
    return isInternalSave;
  }

  // ?????????????????????
  setInternalSave(value: boolean) {
    isInternalSave = value;
  }
}

export const fileSystemService: FileSystemService = new TauriFileSystemService();
