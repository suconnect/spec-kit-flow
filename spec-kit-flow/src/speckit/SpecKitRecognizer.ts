/**
 * SpecKit ???
 * ?? spec-kit ???????????????
 */

import { SPEC_KIT_PATTERNS, getNodeIcon } from './patterns'
import type { SpecKitFlowNode } from '../types/speckit'

/**
 * SpecKit ????
 */
export class SpecKitRecognizer {
  /**
   * ??????? spec-kit ??
   * @param node - SpecKitFlowNode
   * @returns ????????????????
   */
  recognize(node: SpecKitFlowNode): SpecKitFlowNode {
    const text = node.data.label || ''
    
    // ????????
    for (const pattern of SPEC_KIT_PATTERNS) {
      if (pattern.match.test(text)) {
        const metadata = pattern.extract(text)
        
        // ??????
        node.type = pattern.type
        
        // ?????? node.data
        node.data = {
          ...node.data,
          ...metadata
        }
        
        // ??????????
        if (!node.data.icon) {
          node.data.icon = getNodeIcon(pattern.type)
        }
        
        // ??????????????
        if (metadata.priority) {
          node.data.priority = this.normalizePriority(metadata.priority as string)
        }
        
        // ???????????????????
        break
      }
    }
    
    // ????????? heading???????
    if (node.type === 'heading' && !node.data.icon) {
      node.data.icon = getNodeIcon('heading')
    }
    
    return node
  }

  /**
   * ????????
   * @param nodes - SpecKitFlowNode[]
   * @returns ????????
   */
  recognizeAll(nodes: SpecKitFlowNode[]): SpecKitFlowNode[] {
    return nodes.map(node => this.recognize(node))
  }

  /**
   * ????????
   * @param priority - ??????
   * @returns ?????????P1/P2/P3?
   */
  private normalizePriority(priority: string): 'P1' | 'P2' | 'P3' | undefined {
    const normalized = priority.toUpperCase().trim()
    
    if (normalized === 'P1' || normalized === 'P0') return 'P1'
    if (normalized === 'P2') return 'P2'
    if (normalized === 'P3') return 'P3'
    
    return undefined
  }

  /**
   * ??????? spec-kit ????
   * @param node - SpecKitFlowNode
   * @param type - ??????
   * @returns ????
   */
  isNodeType(node: SpecKitFlowNode, type: string): boolean {
    return node.type === type
  }

  /**
   * ??????????
   * @param nodes - ????
   * @returns ????????
   */
  getUserStories(nodes: SpecKitFlowNode[]): SpecKitFlowNode[] {
    return nodes.filter(node => node.type === 'user-story')
  }

  /**
   * ???????????
   * @param nodes - ????
   * @returns ?????????
   */
  getFunctionalRequirements(nodes: SpecKitFlowNode[]): SpecKitFlowNode[] {
    return nodes.filter(node => node.type === 'functional-requirement')
  }

  /**
   * ????????
   * @param nodes - ????
   * @param priority - ????P1/P2/P3?
   * @returns ????????
   */
  filterByPriority(nodes: SpecKitFlowNode[], priority: 'P1' | 'P2' | 'P3'): SpecKitFlowNode[] {
    return nodes.filter(node => node.data.priority === priority)
  }

  /**
   * ????????
   * @param nodes - ????
   * @returns ????
   */
  getStatistics(nodes: SpecKitFlowNode[]): {
    total: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  } {
    const stats = {
      total: nodes.length,
      byType: {} as Record<string, number>,
      byPriority: {} as Record<string, number>
    }

    nodes.forEach(node => {
      // ????
      const type = node.type || 'unknown'
      stats.byType[type] = (stats.byType[type] || 0) + 1

      // ?????
      if (node.data.priority) {
        const priority = node.data.priority
        stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1
      }
    })

    return stats
  }
}

// ????
export const specKitRecognizer = new SpecKitRecognizer()
