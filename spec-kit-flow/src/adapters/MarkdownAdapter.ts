/**
 * Markdown ?????? Mock ???
 * 
 * ??????????? Agent-3 ?????
 * Agent-2 ??????????? unified/remark ???
 */

import type { SpecKitFlowNode } from '../types/speckit';

/**
 * ??? Markdown ????Mock?
 */
export class MarkdownAdapter {
  /**
   * ?? Markdown ?????????????
   */
  parseMarkdownToNodes(markdown: string): SpecKitFlowNode[] {
    const lines = markdown.split('\n');
    const nodes: SpecKitFlowNode[] = [];
    let currentId = 1;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) continue;
      
      // ????
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2];
        
        nodes.push({
          id: `node_${currentId++}`,
          type: 'heading',
          meta: {
            position: { x: (level - 1) * 300, y: nodes.length * 100 },
          },
          data: {
            title,
            content: title,
            preview: title.slice(0, 50),
            level,
            markdownContent: line,
          },
        });
        continue;
      }
      
      // ?????
      const listMatch = trimmedLine.match(/^-\s+(.+)$/);
      if (listMatch) {
        nodes.push({
          id: `node_${currentId++}`,
          type: 'list-item',
          meta: {
            position: { x: 300, y: nodes.length * 100 },
          },
          data: {
            content: trimmedLine,
            preview: listMatch[1].slice(0, 50),
            markdownContent: line,
          },
        });
        continue;
      }
      
      // ??
      if (trimmedLine.length > 0) {
        nodes.push({
          id: `node_${currentId++}`,
          type: 'paragraph',
          meta: {
            position: { x: 300, y: nodes.length * 100 },
          },
          data: {
            content: trimmedLine,
            preview: trimmedLine.slice(0, 50),
            markdownContent: line,
          },
        });
      }
    }
    
    return nodes;
  }
  
  /**
   * ???????? Markdown ????????
   */
  buildNodesToMarkdown(nodes: SpecKitFlowNode[]): string {
    return nodes
      .map((node) => {
        if (node.data.markdownContent) {
          return node.data.markdownContent;
        }
        
        // ???????? Markdown
        if (node.type === 'heading' && node.data.level) {
          return `${'#'.repeat(node.data.level)} ${node.data.title || node.data.content}`;
        }
        
        return node.data.content || '';
      })
      .filter(Boolean)
      .join('\n');
  }
}

/**
 * ???? Markdown ?????
 */
export const markdownAdapter = new MarkdownAdapter();
