/**
 * SpecKit ????
 * 
 * ?? spec-kit ????????????
 */

import type { FlowNodeJSON } from '../typings/node';

/**
 * SpecKit ????
 */
export type SpecKitNodeType =
  | 'user-story'
  | 'acceptance-scenario'
  | 'functional-requirement'
  | 'success-criteria'
  | 'boundary-case'
  | 'task'
  | 'heading'
  | 'paragraph'
  | 'priority-marker';

/**
 * ?????
 */
export type PriorityLevel = 'P1' | 'P2' | 'P3';

/**
 * SpecKit ??????? FlowNodeJSON?
 */
export interface SpecKitFlowNode extends FlowNodeJSON {
  type: SpecKitNodeType | string;
  data: {
    // ????
    title?: string;
    content?: string;
    preview?: string;
    
    // spec-kit ????
    specKitType?: SpecKitNodeType;
    priority?: PriorityLevel;
    storyNumber?: number;
    requirementId?: string;
    criteriaId?: string;
    taskDescription?: string;
    completed?: boolean;
    isAcceptanceSection?: boolean;
    isBoundarySection?: boolean;
    
    // Markdown AST ??????????
    astNodeRef?: any;
    markdownContent?: string;
    
    // ???
    status?: 'draft' | 'completed' | 'ai-generating';
    wordCount?: number;
    lastModified?: number;
    level?: number; // Markdown ???? (1-6)
    
    // ?? flowgram.ai ????
    inputsValues?: Record<string, any>;
    inputs?: any;
    outputs?: any;
    [key: string]: any;
  };
}

/**
 * SpecKit ????
 */
export type SpecKitPatternType =
  | 'user-story'
  | 'acceptance-scenario'
  | 'functional-requirement'
  | 'success-criteria'
  | 'boundary-case'
  | 'task'
  | 'priority-marker';

/**
 * SpecKit ????
 */
export interface SpecKitPattern {
  type: SpecKitPatternType;
  match: RegExp;
  extract: (text: string) => Record<string, any>;
}

/**
 * SpecKit ????
 */
export interface SpecKitRecognitionResult {
  recognized: boolean;
  type?: SpecKitPatternType;
  metadata?: Record<string, any>;
}
