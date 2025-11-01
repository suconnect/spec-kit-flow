/**
 * Markdown ???????
 * 
 * ??"?? Markdown ??"?????????? spec.md ???
 */

import React, { useCallback, useRef, useState } from 'react';
import { Button, Toast } from '@douyinfe/semi-ui';
import { IconUpload } from '@douyinfe/semi-icons';
import { markdownAdapter } from '../adapters';
import { specKitRecognizer } from '../speckit';
import type { SpecKitFlowNode } from '../types/speckit';

interface MarkdownLoaderProps {
  onLoadNodes: (nodes: SpecKitFlowNode[]) => void;
}

export const MarkdownLoader: React.FC<MarkdownLoaderProps> = ({ onLoadNodes }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // ??????
    if (!file.name.endsWith('.md')) {
      Toast.error('??? Markdown ???.md?');
      return;
    }
    
    try {
      setLoading(true);
      
      // ??????
      const text = await file.text();
      
      // 1. ?? Markdown Adapter ????
      let nodes = markdownAdapter.parseMarkdownToNodes(text);
      
      // 2. ?? SpecKit Recognizer ?? spec-kit ??
      nodes = specKitRecognizer.recognizeAll(nodes);
      
      // 3. ?????????
      onLoadNodes(nodes);
      
      Toast.success(`???? ${file.name}?? ${nodes.length} ???`);
      
      // ?? input???????????
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('?? Markdown ????:', error);
      Toast.error(`????: ${error instanceof Error ? error.message : '????'}`);
    } finally {
      setLoading(false);
    }
  }, [onLoadNodes]);
  
  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);
  
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <Button
        icon={<IconUpload />}
        onClick={handleButtonClick}
        loading={loading}
        theme="solid"
        type="primary"
      >
        ?? Markdown ??
      </Button>
    </>
  );
};
