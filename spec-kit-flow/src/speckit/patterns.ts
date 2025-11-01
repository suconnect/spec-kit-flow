/**
 * SpecKit ????
 * 
 * ???? spec-kit ?????????
 */

import type { SpecKitPattern } from '../types/speckit';

/**
 * ?? SpecKit ????
 */
export const SPEC_KIT_PATTERNS: SpecKitPattern[] = [
  /**
   * ?? 1: ????
   * ??: ### ???? N - ???????PN?
   * ??: ### ???? 1 - Markdown ????????????P1?
   */
  {
    type: 'user-story',
    match: /^????\s+(\d+)\s*-\s*(.+?)(?:?????(P\d+)?)?$/,
    extract: (text: string) => {
      const match = text.match(/^????\s+(\d+)\s*-\s*(.+?)(?:?????(P\d+)?)?$/);
      if (!match) return {};
      
      return {
        storyNumber: parseInt(match[1], 10),
        title: match[2].trim(),
        priority: match[3] || undefined,
        specKitType: 'user-story',
      };
    },
  },
  
  /**
   * ?? 2: ????
   * ??: #### ????
   */
  {
    type: 'acceptance-scenario',
    match: /^????$/,
    extract: () => ({
      isAcceptanceSection: true,
      specKitType: 'acceptance-scenario',
    }),
  },
  
  /**
   * ?? 3: ?????
   * ??: - **FR-001**: ??
   * ??: - **FR-001**: ?????? flowgram.ai demo-free-layout ??????
   */
  {
    type: 'functional-requirement',
    match: /^-\s+\*\*FR-(\d+)\*\*:/,
    extract: (text: string) => {
      const match = text.match(/^-\s+\*\*FR-(\d+)\*\*:\s*(.*)$/);
      if (!match) return {};
      
      return {
        requirementId: `FR-${match[1].padStart(3, '0')}`,
        content: match[2].trim(),
        specKitType: 'functional-requirement',
      };
    },
  },
  
  /**
   * ?? 4: ????
   * ??: - **SC-001**: ??
   * ??: - **SC-001**: ????? 5 ?????????????????????????
   */
  {
    type: 'success-criteria',
    match: /^-\s+\*\*SC-(\d+)\*\*:/,
    extract: (text: string) => {
      const match = text.match(/^-\s+\*\*SC-(\d+)\*\*:\s*(.*)$/);
      if (!match) return {};
      
      return {
        criteriaId: `SC-${match[1].padStart(3, '0')}`,
        content: match[2].trim(),
        specKitType: 'success-criteria',
      };
    },
  },
  
  /**
   * ?? 5: ????
   * ??: ### ????
   */
  {
    type: 'boundary-case',
    match: /^????$/,
    extract: () => ({
      isBoundarySection: true,
      specKitType: 'boundary-case',
    }),
  },
  
  /**
   * ?? 6: ????
   * ??: - [ ] ????
   * ??: - [x] ?????
   * ??: - [ ] flowgram.ai ?????????
   */
  {
    type: 'task',
    match: /^-\s+\[([ x])\]\s+(.+)$/,
    extract: (text: string) => {
      const match = text.match(/^-\s+\[([ x])\]\s+(.+)$/);
      if (!match) return {};
      
      return {
        taskDescription: match[2].trim(),
        completed: match[1] === 'x',
        specKitType: 'task',
      };
    },
  },
  
  /**
   * ?? 7: ???????????
   * ??: ?????PN?
   * ??: ?? PM?????P1?????...
   */
  {
    type: 'priority-marker',
    match: /?????(P\d+)?/,
    extract: (text: string) => {
      const match = text.match(/?????(P\d+)?/);
      if (!match) return {};
      
      return {
        priority: match[1],
      };
    },
  },
];

/**
 * ???????????
 */
export function findMatchingPattern(text: string): SpecKitPattern | undefined {
  return SPEC_KIT_PATTERNS.find((pattern) => pattern.match.test(text));
}

/**
 * ?????????? spec-kit ??
 */
export function isSpecKitPattern(text: string): boolean {
  return SPEC_KIT_PATTERNS.some((pattern) => pattern.match.test(text));
}
