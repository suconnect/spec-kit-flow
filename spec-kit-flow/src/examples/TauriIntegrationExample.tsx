import React, { useState, useEffect, useCallback } from 'react';
import { fileSystemService, FileChangeEvent } from '../services/fileSystem';
import { useConflictDetection } from '../hooks/useConflictDetection';
import { useAIGenerationDetection } from '../hooks/useAIGenerationDetection';
import { ConflictDialog } from '../components/conflict';

/**
 * ??????????? Tauri ??????
 * 
 * ?????? Wave 2 ??????????
 * - Task 5.1-5.4: ???????
 * - Task 5.5: ??????
 * - Task 5.6: ??????
 * - Task 5.7: AI ??????
 */
export const TauriIntegrationExample: React.FC = () => {
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ???? hook
  const {
    hasUnsavedChanges,
    conflictState,
    handleContentChange,
    handleSaveSuccess,
    handleFileChanged,
    handleKeepLocal,
    handleLoadExternal,
    handleCancelConflict,
  } = useConflictDetection(currentFilePath || '');

  // AI ???? hook
  const { isAIGenerating, detectAIGeneration } = useAIGenerationDetection();

  // ????
  const handleSelectFile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filePath = await fileSystemService.selectFile();
      if (!filePath) {
        setIsLoading(false);
        return;
      }

      // ??????
      const content = await fileSystemService.readFile(filePath);
      setCurrentFilePath(filePath);
      setFileContent(content);
      handleSaveSuccess(content);

      // ??????
      await fileSystemService.watchFile(filePath, handleFileChange);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [handleSaveSuccess]);

  // ??????
  const handleFileChange = useCallback(async (event: FileChangeEvent) => {
    console.log('[TauriIntegration] File changed:', event);

    // AI ????
    const isAI = detectAIGeneration(event);
    if (isAI) {
      console.log('[TauriIntegration] AI generation detected');
      return; // AI ???????
    }

    // ????
    const externalContent = await handleFileChanged(event, () => fileContent);
    if (externalContent) {
      // ????????????
      setFileContent(externalContent);
      handleSaveSuccess(externalContent);
    }
  }, [fileContent, handleFileChanged, handleSaveSuccess, detectAIGeneration]);

  // ????
  const handleSaveFile = useCallback(async () => {
    if (!currentFilePath) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await fileSystemService.writeFile(currentFilePath, fileContent);
      handleSaveSuccess(fileContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [currentFilePath, fileContent, handleSaveSuccess]);

  // ????
  const handleEditContent = useCallback((newContent: string) => {
    setFileContent(newContent);
    handleContentChange(newContent);
  }, [handleContentChange]);

  // ????? - ????
  const handleConflictKeepLocal = useCallback(async () => {
    if (!conflictState) return;
    try {
      await handleKeepLocal(conflictState.localContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [conflictState, handleKeepLocal]);

  // ????? - ????
  const handleConflictLoadExternal = useCallback(() => {
    if (!conflictState) return;
    const externalContent = handleLoadExternal(conflictState.externalContent);
    setFileContent(externalContent);
  }, [conflictState, handleLoadExternal]);

  const isAIGeneratingCurrent = currentFilePath && isAIGenerating(currentFilePath);

  return (
    <div className="tauri-integration-example">
      <div className="toolbar">
        <button onClick={handleSelectFile} disabled={isLoading}>
          ?? Markdown ??
        </button>
        
        <button 
          onClick={handleSaveFile} 
          disabled={!currentFilePath || isLoading || !hasUnsavedChanges}
        >
          ?? {hasUnsavedChanges && '(??????)'}
        </button>

        {isAIGeneratingCurrent && (
          <div className="ai-badge">
            ? AI ???
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          ??: {error}
        </div>
      )}

      {currentFilePath && (
        <div className="file-info">
          ????: {currentFilePath}
        </div>
      )}

      <div className={`content-editor ${isAIGeneratingCurrent ? 'locked' : ''}`}>
        <textarea
          value={fileContent}
          onChange={(e) => handleEditContent(e.target.value)}
          disabled={isLoading || isAIGeneratingCurrent}
          placeholder="???? Markdown ??????..."
          rows={20}
          cols={80}
        />
      </div>

      {conflictState?.showDialog && (
        <ConflictDialog
          localContent={conflictState.localContent}
          externalContent={conflictState.externalContent}
          lastSavedContent={conflictState.lastSavedContent}
          onKeepLocal={handleConflictKeepLocal}
          onLoadExternal={handleConflictLoadExternal}
          onCancel={handleCancelConflict}
        />
      )}
    </div>
  );
};
