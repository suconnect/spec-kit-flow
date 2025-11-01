/**
 * Markdown ??????
 * ???? Markdown ?????? flowgram ?????
 */

import React, { useCallback, useRef, useState } from 'react'
import { markdownAdapter } from '../../adapters'
import { specKitRecognizer } from '../../speckit'
import type { SpecKitFlowNode } from '../../types/speckit'

interface MarkdownImportProps {
  onNodesLoaded?: (nodes: SpecKitFlowNode[]) => void
}

export const MarkdownImport: React.FC<MarkdownImportProps> = ({ onNodesLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // ??????
    if (!file.name.endsWith('.md')) {
      setError('??? Markdown ???.md?')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // 1. ??????
      const markdown = await file.text()
      
      console.log('[MarkdownImport] ?????????:', markdown.length)

      // 2. ?????
      let nodes = markdownAdapter.parseMarkdownToNodes(markdown)
      console.log('[MarkdownImport] ????', nodes.length, '???')

      // 3. ?? spec-kit ??
      nodes = specKitRecognizer.recognizeAll(nodes)
      console.log('[MarkdownImport] SpecKit ????')

      // 4. ????
      const stats = specKitRecognizer.getStatistics(nodes)
      console.log('[MarkdownImport] ????:', stats)

      // 5. ?????
      if (onNodesLoaded) {
        onNodesLoaded(nodes)
      }

      setSuccess(`???? ${nodes.length} ???`)
      
      // 3????????
      setTimeout(() => setSuccess(null), 3000)

    } catch (err) {
      console.error('[MarkdownImport] ????:', err)
      setError(err instanceof Error ? err.message : '????')
    } finally {
      setIsLoading(false)
      
      // ?????????????????
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [onNodesLoaded])

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className="markdown-import-container" style={{ padding: '8px' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".md"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
          color: '#fff',
          backgroundColor: isLoading ? '#ccc' : '#1890ff',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        {isLoading ? '???...' : '?? ?? Markdown ??'}
      </button>

      {error && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: '#ff4d4f',
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '4px'
          }}
        >
          ? {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: '#52c41a',
            backgroundColor: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '4px'
          }}
        >
          ? {success}
        </div>
      )}
    </div>
  )
}
