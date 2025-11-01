/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useCallback, useState } from 'react';
import { EditorRenderer, FreeLayoutEditorProvider } from '@flowgram.ai/free-layout-editor';
import type { FlowDocumentJSON } from '@flowgram.ai/free-layout-editor';

import '@flowgram.ai/free-layout-editor/index.css';
import './styles/index.css';
import { nodeRegistries } from './nodes';
import { initialData } from './initial-data';
import { useEditorProps } from './hooks';
import { DemoTools } from './components/tools';
import { MarkdownLoader } from './components/MarkdownLoader';
import type { SpecKitFlowNode } from './types/speckit';

export const Editor = () => {
  const [documentData, setDocumentData] = useState<FlowDocumentJSON>(initialData);
  
  const handleLoadMarkdownNodes = useCallback((nodes: SpecKitFlowNode[]) => {
    // ?? SpecKitFlowNode ? FlowDocumentJSON
    const newDocument: FlowDocumentJSON = {
      nodes: nodes as any[], // SpecKitFlowNode ??? FlowNodeJSON
      edges: [],
      globalVariable: documentData.globalVariable,
    };
    
    setDocumentData(newDocument);
  }, [documentData.globalVariable]);
  
  const editorProps = useEditorProps(documentData, nodeRegistries);
  
  return (
    <div className="doc-free-feature-overview">
      <FreeLayoutEditorProvider {...editorProps}>
        <div className="demo-container">
          {/* ?? Markdown ?????? */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 1000,
            display: 'flex',
            gap: '10px',
          }}>
            <MarkdownLoader onLoadNodes={handleLoadMarkdownNodes} />
          </div>
          
          <EditorRenderer className="demo-editor" />
        </div>
        <DemoTools />
      </FreeLayoutEditorProvider>
    </div>
  );
};
