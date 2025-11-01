/**
 * SpecKit ???
 * 
 * ???? Markdown ???? spec-kit ?????
 * ??????????????????????ID??
 */

import type { SpecKitFlowNode, SpecKitRecognitionResult } from '../types/speckit';
import { SPEC_KIT_PATTERNS, findMatchingPattern } from './patterns';

/**
 * SpecKit ????
 */
export class SpecKitRecognizer {
  /**
   * ??????? spec-kit ??
   * 
   * @param node - ??????
   * @returns ?????????????????
   */
  recognize(node: SpecKitFlowNode): SpecKitFlowNode {
    const text = node.data.title || node.data.content || '';
    
    if (!text) {
      return node;
    }
    
    // ????????
    const pattern = findMatchingPattern(text);
    
    if (pattern) {
      const metadata = pattern.extract(text);
      
      // ??????????????
      if (metadata.specKitType) {
        node.type = metadata.specKitType;
      }
      
      // ???????? data
      node.data = {
        ...node.data,
        ...metadata,
      };
    }
    
    return node;
  }
  
  /**
   * ????????
   * 
   * @param nodes - ????
   * @returns ????????
   */
  recognizeAll(nodes: SpecKitFlowNode[]): SpecKitFlowNode[] {
    return nodes.map((node) => this.recognize(node));
  }
  
  /**
   * ??????? spec-kit ??
   * 
   * @param node - ??????
   * @returns ??? spec-kit ??
   */
  isSpecKitNode(node: SpecKitFlowNode): boolean {
    return !!node.data.specKitType;
  }
  
  /**
   * ?????????????????
   * 
   * @param node - ??????
   * @returns ????
   */
  getRecognitionResult(node: SpecKitFlowNode): SpecKitRecognitionResult {
    const text = node.data.title || node.data.content || '';
    
    if (!text) {
      return { recognized: false };
    }
    
    const pattern = findMatchingPattern(text);
    
    if (pattern) {
      const metadata = pattern.extract(text);
      return {
        recognized: true,
        type: pattern.type,
        metadata,
      };
    }
    
    return { recognized: false };
  }
  
  /**
   * ?????????
   * 
   * @param text - ??????
   * @returns ????P1/P2/P3?? undefined
   */
  extractPriority(text: string): 'P1' | 'P2' | 'P3' | undefined {
    const priorityPattern = SPEC_KIT_PATTERNS.find((p) => p.type === 'priority-marker');
    
    if (priorityPattern && priorityPattern.match.test(text)) {
      const metadata = priorityPattern.extract(text);
      return metadata.priority as 'P1' | 'P2' | 'P3' | undefined;
    }
    
    return undefined;
  }
  
  /**
   * ????????????
   * 
   * @param text - ??????
   * @returns ??????? undefined
   */
  extractStoryNumber(text: string): number | undefined {
    const userStoryPattern = SPEC_KIT_PATTERNS.find((p) => p.type === 'user-story');
    
    if (userStoryPattern && userStoryPattern.match.test(text)) {
      const metadata = userStoryPattern.extract(text);
      return metadata.storyNumber;
    }
    
    return undefined;
  }
}

/**
 * ???? SpecKit ???????????
 */
export const specKitRecognizer = new SpecKitRecognizer();
