/**
 * SpecKit Flow ??????
 * ?? flowgram.ai ???????? spec-kit ??
 */

import type { Root } from 'mdast'

/**
 * ?? flowgram.ai ??????????????
 */
export interface FlowgramNode {
  id: string
  type: string
  position: {
    x: number
    y: number
  }
  size?: {
    width: number
    height: number
  }
  data: Record<string, any>
  children?: string[]
}

/**
 * SpecKit Flow ????
 * ? flowgram.ai ??????? spec-kit ????
 */
export interface SpecKitFlowNode extends FlowgramNode {
  data: {
    // ????
    label: string              // ????
    content: string            // ?????Markdown?
    preview: string            // ?????? 50 ??
    
    // spec-kit ???
    priority?: 'P1' | 'P2' | 'P3'        // ???
    storyNumber?: number                  // ??????
    requirementId?: string                // ?? ID?FR-001, SC-001 ??
    status?: 'draft' | 'completed' | 'ai-generating'  // ??
    wordCount?: number                    // ????
    lastModified?: number                 // ???????
    
    // AST ??????????
    astNodeRef?: any                      // ???? Markdown AST ????
    
    // ????
    depth?: number                        // Markdown ?????1-6?
    
    // ????
    collapsed?: boolean                   // ????
    
    // ??????
    [key: string]: any
  }
}

/**
 * Markdown ?????
 */
export interface MarkdownAdapterConfig {
  preserveFormatting?: boolean          // ????????
  generateIds?: 'hash' | 'sequential'   // ID ????
  defaultPriority?: 'P1' | 'P2' | 'P3'  // ?????
}

/**
 * SpecKit ????
 */
export type SpecKitPatternType =
  | 'user-story'              // ????
  | 'acceptance-scenario'     // ????
  | 'functional-requirement'  // ?????
  | 'success-criteria'        // ????
  | 'boundary-case'           // ????
  | 'task'                    // ????
  | 'priority-marker'         // ?????

/**
 * SpecKit ????
 */
export interface SpecKitPattern {
  type: SpecKitPatternType
  match: RegExp
  extract: (text: string) => Record<string, any>
}

/**
 * ????
 */
export interface ValidationResult {
  valid: boolean
  errors?: string[]
  warnings?: string[]
}

/**
 * ??????
 */
export interface FileChangedEvent {
  path: string
  size?: number
  timestamp?: number
  changeType?: 'create' | 'modify' | 'delete'
}

/**
 * ??????
 */
export type ConflictResolution = 'keep-local' | 'load-external' | 'show-diff' | 'cancel'

/**
 * AI ??????
 */
export interface AIGenerationState {
  isGenerating: boolean
  filePath: string
  startTime: number
  changeCount: number
}
