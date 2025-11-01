import { useState, useCallback } from 'react';
import { fileSystemService, FileChangeEvent } from '../services/fileSystem';

export interface ConflictState {
  localContent: string;
  externalContent: string;
  lastSavedContent: string;
  showDialog: boolean;
}

export function useConflictDetection(currentFilePath: string) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState('');
  const [conflictState, setConflictState] = useState<ConflictState | null>(null);

  // ???????
  const handleContentChange = useCallback((content: string) => {
    setHasUnsavedChanges(content !== lastSavedContent);
  }, [lastSavedContent]);

  // ???????
  const handleSaveSuccess = useCallback((content: string) => {
    setLastSavedContent(content);
    setHasUnsavedChanges(false);
  }, []);

  // ??????
  const handleFileChanged = useCallback(async (
    event: FileChangeEvent,
    getCurrentContent: () => string
  ) => {
    // ??????????
    if ((fileSystemService as any).isInternalSave?.()) {
      return;
    }

    try {
      // ?????????
      const externalContent = await fileSystemService.readFile(currentFilePath);

      // ?????????????
      if (hasUnsavedChanges) {
        // ????????
        setConflictState({
          localContent: getCurrentContent(),
          externalContent,
          lastSavedContent,
          showDialog: true,
        });
      } else {
        // ????????????????????????
        return externalContent;
      }
    } catch (error) {
      console.error('[ConflictDetection] Failed to read external content:', error);
    }
  }, [hasUnsavedChanges, lastSavedContent, currentFilePath]);

  // ????????????
  const handleKeepLocal = useCallback(async (localContent: string) => {
    try {
      await fileSystemService.writeFile(currentFilePath, localContent);
      setLastSavedContent(localContent);
      setHasUnsavedChanges(false);
      setConflictState(null);
    } catch (error) {
      console.error('[ConflictDetection] Failed to keep local:', error);
      throw error;
    }
  }, [currentFilePath]);

  // ??????????????
  const handleLoadExternal = useCallback((externalContent: string) => {
    setLastSavedContent(externalContent);
    setHasUnsavedChanges(false);
    setConflictState(null);
    return externalContent;
  }, []);

  // ???????
  const handleCancelConflict = useCallback(() => {
    setConflictState(null);
  }, []);

  return {
    hasUnsavedChanges,
    conflictState,
    handleContentChange,
    handleSaveSuccess,
    handleFileChanged,
    handleKeepLocal,
    handleLoadExternal,
    handleCancelConflict,
  };
}
