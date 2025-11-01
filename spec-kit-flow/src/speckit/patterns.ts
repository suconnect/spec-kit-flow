/**
 * SpecKit ????
 * ?? spec-kit ?????????????
 */

import type { SpecKitPattern, SpecKitPatternType } from '../types/speckit'

/**
 * SpecKit ??????
 */
export const SPEC_KIT_PATTERNS: SpecKitPattern[] = [
  {
    type: 'user-story',
    match: /^????\s*(\d+)\s*-\s*(.+?)(?:?????(P\d+)?)?$/i,
    extract: (text: string) => {
      const match = text.match(/^????\s*(\d+)\s*-\s*(.+?)(?:?????(P\d+)?)?$/i)
      if (!match) return {}
      
      return {
        storyNumber: parseInt(match[1], 10),
        title: match[2].trim(),
        priority: match[3] || undefined
      }
    }
  },
  
  {
    type: 'acceptance-scenario',
    match: /^????$/i,
    extract: () => ({
      isAcceptanceSection: true
    })
  },
  
  {
    type: 'functional-requirement',
    match: /^-\s*\*\*FR-(\d+)\*\*:/,
    extract: (text: string) => {
      const match = text.match(/^-\s*\*\*FR-(\d+)\*\*:/)
      if (!match) return {}
      
      return {
        requirementId: `FR-${match[1]}`
      }
    }
  },
  
  {
    type: 'success-criteria',
    match: /^-\s*\*\*SC-(\d+)\*\*:/,
    extract: (text: string) => {
      const match = text.match(/^-\s*\*\*SC-(\d+)\*\*:/)
      if (!match) return {}
      
      return {
        criteriaId: `SC-${match[1]}`
      }
    }
  },
  
  {
    type: 'boundary-case',
    match: /^????$/i,
    extract: () => ({
      isBoundarySection: true
    })
  },
  
  {
    type: 'task',
    match: /^-\s*\[\s*\]\s*(.+)$/,
    extract: (text: string) => {
      const match = text.match(/^-\s*\[\s*\]\s*(.+)$/)
      if (!match) return {}
      
      return {
        taskDescription: match[1].trim(),
        completed: false
      }
    }
  },
  
  {
    type: 'task',
    match: /^-\s*\[[xX]\]\s*(.+)$/,
    extract: (text: string) => {
      const match = text.match(/^-\s*\[[xX]\]\s*(.+)$/)
      if (!match) return {}
      
      return {
        taskDescription: match[1].trim(),
        completed: true
      }
    }
  },
  
  {
    type: 'priority-marker',
    match: /?????(P\d+)?/,
    extract: (text: string) => {
      const match = text.match(/?????(P\d+)?/)
      if (!match) return {}
      
      return {
        priority: match[1]
      }
    }
  }
]

/**
 * ??????????
 * @param type - ????
 * @returns ??????emoji ????
 */
export function getNodeIcon(type: SpecKitPatternType | string): string {
  const iconMap: Record<string, string> = {
    'user-story': '??',
    'acceptance-scenario': '??',
    'functional-requirement': '??',
    'success-criteria': '?',
    'boundary-case': '??',
    'task': '??',
    'heading': '??',
    'section': '??',
    'default': '??'
  }
  
  return iconMap[type] || iconMap['default']
}

/**
 * ???????????
 * @param priority - ????P1/P2/P3?
 * @returns CSS ??
 */
export function getPriorityClassName(priority?: string): string {
  if (!priority) return ''
  
  const classMap: Record<string, string> = {
    'P1': 'priority-high',
    'P2': 'priority-medium',
    'P3': 'priority-low'
  }
  
  return classMap[priority] || ''
}

/**
 * ?????????
 * @param priority - ???
 * @returns ???????
 */
export function getPriorityColor(priority?: string): string {
  const colorMap: Record<string, string> = {
    'P1': '#ff4d4f',  // ??
    'P2': '#fa8c16',  // ??
    'P3': '#1890ff'   // ??
  }
  
  return priority ? (colorMap[priority] || '#d9d9d9') : '#d9d9d9'
}
