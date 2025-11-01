/**
 * SpecKit ????
 * ?? spec-kit ?????????????
 */

import type { SpecKitPattern } from '../types/speckit'

/**
 * SpecKit ?????7??
 */
export const SPEC_KIT_PATTERNS: SpecKitPattern[] = [
  // 1. ??????
  {
    type: 'user-story',
    match: /^????\s+(\d+)\s*-\s*(.+?)(?:?????(P\d+)?)?$/,
    extract: (text) => {
      const match = text.match(/^????\s+(\d+)\s*-\s*(.+?)(?:?????(P\d+)?)?$/)
      if (!match) return {}
      return {
        storyNumber: parseInt(match[1]),
        title: match[2].trim(),
        priority: match[3] || undefined
      }
    }
  },

  // 2. ??????
  {
    type: 'acceptance-scenario',
    match: /^????$/,
    extract: () => ({
      isAcceptanceSection: true
    })
  },

  // 3. ???????
  {
    type: 'functional-requirement',
    match: /^-\s*\*\*FR-(\d+)\*\*:/,
    extract: (text) => {
      const match = text.match(/^-\s*\*\*FR-(\d+)\*\*:/)
      if (!match) return {}
      return {
        requirementId: `FR-${match[1]}`,
        requirementType: 'functional'
      }
    }
  },

  // 4. ??????
  {
    type: 'success-criteria',
    match: /^-\s*\*\*SC-(\d+)\*\*:/,
    extract: (text) => {
      const match = text.match(/^-\s*\*\*SC-(\d+)\*\*:/)
      if (!match) return {}
      return {
        criteriaId: `SC-${match[1]}`,
        criteriaType: 'success'
      }
    }
  },

  // 5. ??????
  {
    type: 'boundary-case',
    match: /^????$/,
    extract: () => ({
      isBoundarySection: true
    })
  },

  // 6. ??????
  {
    type: 'task',
    match: /^-\s*\[\s*([x ])\s*\]\s+(.+)$/i,
    extract: (text) => {
      const match = text.match(/^-\s*\[\s*([x ])\s*\]\s+(.+)$/i)
      if (!match) return {}
      return {
        taskDescription: match[2].trim(),
        completed: match[1].toLowerCase() === 'x',
        isTask: true
      }
    }
  },

  // 7. ?????????????????
  {
    type: 'priority-marker',
    match: /?????(P\d+)?/,
    extract: (text) => {
      const match = text.match(/?????(P\d+)?/)
      if (!match) return {}
      return {
        priority: match[1]
      }
    }
  }
]

/**
 * ???????????
 * @param type - ????
 * @returns ?????
 */
export function getNodeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    'user-story': '??',
    'acceptance-scenario': '?',
    'functional-requirement': '??',
    'success-criteria': '??',
    'boundary-case': '??',
    'task': '??',
    'heading': '??'
  }
  
  return iconMap[type] || '??'
}

/**
 * ???????
 * @param priority - ????P1/P2/P3?
 * @returns ????
 */
export function getPriorityColor(priority?: string): string {
  if (!priority) return '#ccc'
  
  const colorMap: Record<string, string> = {
    'P1': '#ff4d4f',  // ??
    'P2': '#fa8c16',  // ??
    'P3': '#1890ff'   // ??
  }
  
  return colorMap[priority] || '#ccc'
}
