/**
 * Markdown ???
 * ?? Markdown AST ? flowgram.ai ?????????
 */

import { unified } from 'unified'
import remarkStringify from 'remark-stringify'
import { visit } from 'unist-util-visit'
import { toString as mdastToString } from 'mdast-util-to-string'
import type { Root, Heading, Content } from 'mdast'
import { nanoid } from 'nanoid'

import { markdownParser } from './MarkdownParser'
import type { SpecKitFlowNode, MarkdownAdapterConfig } from '../types/speckit'

/**
 * Markdown ????
 */
export class MarkdownAdapter {
  private config: MarkdownAdapterConfig
  private stringifier: ReturnType<typeof unified>
  private currentNodes: SpecKitFlowNode[] = []

  constructor(config: MarkdownAdapterConfig = {}) {
    this.config = {
      preserveFormatting: true,
      generateIds: 'hash',
      ...config
    }

    // ??? Markdown ????
    this.stringifier = unified().use(remarkStringify, {
      bullet: '-',
      fence: '`',
      fences: true,
      incrementListMarker: true
    })
  }

  /**
   * ?? Markdown ??? flowgram.ai ??
   * @param markdown - Markdown ??
   * @returns SpecKitFlowNode[] ????
   */
  parseMarkdownToNodes(markdown: string): SpecKitFlowNode[] {
    // 1. ??? AST
    const ast = markdownParser.parse(markdown)
    
    // 2. ?? AST???????
    const nodes: SpecKitFlowNode[] = []
    const nodeStack: Array<{ node: SpecKitFlowNode; depth: number }> = []
    
    visit(ast, (astNode, index, parent) => {
      if (astNode.type === 'heading') {
        const heading = astNode as Heading
        const flowNode = this.createNodeFromHeading(heading, ast)
        
        // ??????????????
        // ?????? >= ???????
        while (nodeStack.length > 0 && nodeStack[nodeStack.length - 1].depth >= heading.depth) {
          nodeStack.pop()
        }
        
        // ????????????????????
        if (nodeStack.length > 0) {
          const parentNode = nodeStack[nodeStack.length - 1].node
          if (!parentNode.children) {
            parentNode.children = []
          }
          parentNode.children.push(flowNode.id)
        }
        
        // ????????
        nodeStack.push({ node: flowNode, depth: heading.depth })
        nodes.push(flowNode)
      }
    })
    
    // ????????????????
    this.currentNodes = nodes
    
    return nodes
  }

  /**
   * ? Heading AST ???? flowgram.ai ??
   * @param heading - Heading AST ??
   * @param root - Root AST ??????????
   * @returns SpecKitFlowNode
   */
  private createNodeFromHeading(heading: Heading, root: Root): SpecKitFlowNode {
    const titleText = mdastToString(heading)
    
    // ????????????????????????
    const content = this.extractContentForHeading(heading, root)
    const preview = content.slice(0, 50) + (content.length > 50 ? '...' : '')
    
    // ?? ID
    const id = this.generateNodeId(titleText)
    
    // ????
    const node: SpecKitFlowNode = {
      id,
      type: 'heading',
      position: { x: 0, y: 0 },  // ???????????
      data: {
        label: titleText,
        content: content,
        preview: preview,
        depth: heading.depth,
        wordCount: content.length,
        lastModified: Date.now(),
        status: 'draft',
        astNodeRef: heading  // ?? AST ??
      }
    }
    
    return node
  }

  /**
   * ???????????????????????
   * @param heading - ????
   * @param root - Root AST
   * @returns ?????
   */
  private extractContentForHeading(heading: Heading, root: Root): string {
    const headingIndex = root.children.indexOf(heading as any)
    if (headingIndex === -1) return ''
    
    const contentNodes: Content[] = []
    const currentDepth = heading.depth
    
    // ?????????????????????????
    for (let i = headingIndex + 1; i < root.children.length; i++) {
      const node = root.children[i]
      
      // ???????????????
      if (node.type === 'heading' && (node as Heading).depth <= currentDepth) {
        break
      }
      
      contentNodes.push(node as Content)
    }
    
    // ????????????
    if (contentNodes.length === 0) {
      return mdastToString(heading)
    }
    
    return contentNodes.map(node => mdastToString(node)).join('\n\n')
  }

  /**
   * ???? ID
   * @param text - ??????
   * @returns ID ???
   */
  private generateNodeId(text: string): string {
    if (this.config.generateIds === 'hash') {
      // ?? nanoid ??? ID
      return nanoid(10)
    } else {
      // ??? ID??????
      return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }
  }

  /**
   * ? flowgram.ai ????? Markdown ??
   * @param nodes - SpecKitFlowNode[] ????
   * @returns Markdown ??
   */
  buildNodesToMarkdown(nodes: SpecKitFlowNode[]): string {
    // 1. ?? AST
    const ast: Root = {
      type: 'root',
      children: []
    }
    
    // 2. ??????????
    const processedIds = new Set<string>()
    
    const traverse = (node: SpecKitFlowNode) => {
      if (processedIds.has(node.id)) return
      processedIds.add(node.id)
      
      // ??????
      const depth = node.data.depth || this.inferDepth(node, nodes)
      
      ast.children.push({
        type: 'heading',
        depth: depth as 1 | 2 | 3 | 4 | 5 | 6,
        children: [
          { type: 'text', value: node.data.label }
        ]
      })
      
      // ?????????
      if (node.data.content && node.data.content !== node.data.label) {
        const contentText = node.data.content.replace(node.data.label, '').trim()
        if (contentText) {
          ast.children.push({
            type: 'paragraph',
            children: [
              { type: 'text', value: contentText }
            ]
          })
        }
      }
      
      // ???????
      if (node.children && node.children.length > 0) {
        node.children.forEach(childId => {
          const childNode = nodes.find(n => n.id === childId)
          if (childNode) {
            traverse(childNode)
          }
        })
      }
    }
    
    // ???????????????
    const rootNodes = nodes.filter(n => 
      !nodes.some(parent => parent.children?.includes(n.id))
    )
    
    rootNodes.forEach(root => traverse(root))
    
    // 3. ???? Markdown
    const markdown = this.stringifier.stringify(ast)
    
    return markdown as string
  }

  /**
   * ???????????????
   * @param node - ????
   * @param nodes - ????
   * @returns ???1-6?
   */
  private inferDepth(node: SpecKitFlowNode, nodes: SpecKitFlowNode[]): number {
    // ????? depth ???????
    if (node.data.depth) return node.data.depth
    
    // ?????
    const parent = nodes.find(n => n.children?.includes(node.id))
    if (!parent) return 1  // ???
    
    // ????????? + 1
    const parentDepth = this.inferDepth(parent, nodes)
    return Math.min(parentDepth + 1, 6)  // ????? 6
  }

  /**
   * ????????
   * @param node - ??
   * @returns ??
   */
  getNodeDepth(node: SpecKitFlowNode): number {
    return node.data.depth || this.inferDepth(node, this.currentNodes)
  }
}

// ????
export const markdownAdapter = new MarkdownAdapter()
