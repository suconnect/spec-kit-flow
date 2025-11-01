/**
 * SpecKit ???
 * ?? spec-kit ???????????????
 */

import { SPEC_KIT_PATTERNS } from './patterns'
import type { SpecKitFlowNode } from '../types/speckit'

/**
 * SpecKit ????
 */
export class SpecKitRecognizer {
  /**
   * ??????? spec-kit ??
   * @param node - flowgram ??
   * @returns ????????? spec-kit ????
   */
  recognize(node: SpecKitFlowNode): SpecKitFlowNode {
    const text = node.data.label || ''
    
    // ????????
    for (const pattern of SPEC_KIT_PATTERNS) {
      if (pattern.match.test(text)) {
        // ?????
        const metadata = pattern.extract(text)
        
        // ?????????????????
        if (pattern.type !== 'priority-marker') {
          node.type = pattern.type
        }
        
        // ???????? data
        node.data = {
          ...node.data,
          ...metadata
        }
        
        // ???????????????????
        if (pattern.type === 'user-story' && metadata.priority) {
          node.data.priority = metadata.priority as 'P1' | 'P2' | 'P3'
        }
        
        // ???????????
        break
      }
    }
    
    // ???????????????????????
    if (!node.data.priority) {
      const priorityMatch = text.match(/?????(P\d+)?/)
      if (priorityMatch) {
        node.data.priority = priorityMatch[1] as 'P1' | 'P2' | 'P3'
      }
    }
    
    return node
  }

  /**
   * ??????
   * @param nodes - flowgram ????
   * @returns ????????
   */
  recognizeAll(nodes: SpecKitFlowNode[]): SpecKitFlowNode[] {
    return nodes.map(node => this.recognize(node))
  }

  /**
   * ????????????
   * @param text - ??
   * @param patternType - ?????????????????
   * @returns ????
   */
  matches(text: string, patternType?: string): boolean {
    const patterns = patternType
      ? SPEC_KIT_PATTERNS.filter(p => p.type === patternType)
      : SPEC_KIT_PATTERNS
    
    return patterns.some(pattern => pattern.match.test(text))
  }

  /**
   * ?????????
   * @param text - ??
   * @returns ?????
   */
  extractMetadata(text: string): Record<string, any> {
    for (const pattern of SPEC_KIT_PATTERNS) {
      if (pattern.match.test(text)) {
        return pattern.extract(text)
      }
    }
    
    return {}
  }

  /**
   * ????????
   * @param nodes - ????
   * @returns ??????
   */
  getNodeTypeStats(nodes: SpecKitFlowNode[]): Record<string, number> {
    const stats: Record<string, number> = {}
    
    nodes.forEach(node => {
      const type = node.type || 'unknown'
      stats[type] = (stats[type] || 0) + 1
    })
    
    return stats
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
   * ?????????
   * @param nodes - ????
   * @param priority - ????P1/P2/P3?
   * @returns ????????
   */
  filterByPriority(nodes: SpecKitFlowNode[], priority: 'P1' | 'P2' | 'P3'): SpecKitFlowNode[] {
    return nodes.filter(node => node.data.priority === priority)
  }
}

// ????
export const specKitRecognizer = new SpecKitRecognizer()
