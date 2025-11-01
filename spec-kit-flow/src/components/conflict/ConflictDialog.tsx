import React from 'react';
import './ConflictDialog.css';

export interface ConflictDialogProps {
  localContent: string;
  externalContent: string;
  lastSavedContent: string;
  onKeepLocal: () => void;
  onLoadExternal: () => void;
  onShowDiff?: () => void;
  onCancel: () => void;
}

export const ConflictDialog: React.FC<ConflictDialogProps> = ({
  localContent,
  externalContent,
  lastSavedContent,
  onKeepLocal,
  onLoadExternal,
  onShowDiff,
  onCancel,
}) => {
  // ??????
  const getWordCountDiff = (content: string, baseContent: string) => {
    const diff = content.length - baseContent.length;
    return diff > 0 ? `+${diff}` : `${diff}`;
  };

  const localDiff = getWordCountDiff(localContent, lastSavedContent);
  const externalDiff = getWordCountDiff(externalContent, lastSavedContent);

  return (
    <div className="conflict-dialog-overlay">
      <div className="conflict-dialog">
        <div className="conflict-dialog-header">
          <h2>?? ????</h2>
        </div>
        
        <div className="conflict-dialog-content">
          <div className="conflict-warning">
            ?????????????????????
          </div>
          
          <div className="conflict-info">
            <div className="conflict-info-item">
              <strong>????:</strong> {localDiff} ???
            </div>
            <div className="conflict-info-item">
              <strong>????:</strong> {externalDiff} ???
            </div>
          </div>
          
          <p className="conflict-prompt">????????</p>
        </div>
        
        <div className="conflict-dialog-actions">
          <button 
            className="conflict-button conflict-button-secondary"
            onClick={onCancel}
          >
            ??
          </button>
          
          <button 
            className="conflict-button conflict-button-warning"
            onClick={onLoadExternal}
          >
            ??????????????
          </button>
          
          {onShowDiff && (
            <button 
              className="conflict-button conflict-button-info"
              onClick={onShowDiff}
            >
              ??????????
            </button>
          )}
          
          <button 
            className="conflict-button conflict-button-primary"
            onClick={onKeepLocal}
          >
            ????????????
          </button>
        </div>
      </div>
    </div>
  );
};
