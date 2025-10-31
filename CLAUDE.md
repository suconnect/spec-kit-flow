# Project Context for AI Agents

## Project Overview

**Spec-Kit Flow** is a visual interface for the Spec-Kit methodology that enables teams to visualize, edit, and manage specifications through an interactive flow-based interface.

## Current Focus

**Phase**: Planning & Specification
**Active Feature**: 001-visual-flow-foundation
**Next Step**: Validate plan and create task breakdown

## Key Decisions

1. **Tech Stack**: React 18 + TypeScript 5 + Vite 5
2. **Desktop Framework**: Tauri 1.5+ (选择 Tauri 而非 Electron，更轻量)
3. **Flow Library**: ReactFlow 11.x (选择 ReactFlow 而非从零实现，更可靠)
4. **State Management**: Zustand 4.x (轻量级，TypeScript 友好)
5. **Markdown Editor**: CodeMirror 6 + react-markdown
6. **File Watching**: Rust notify crate (通过 Tauri)
7. **Development Approach**: Strict adherence to SDD (Spec-Driven Development)

## Active Specifications

### 001-visual-flow-foundation
- **Status**: Ready for Implementation ✅
- **Files**:
  - ✅ `specs/001-visual-flow-foundation/spec.md` - 完整需求规范
  - ✅ `specs/001-visual-flow-foundation/plan.md` - 详细实施计划 (10 phases)
  - ✅ `specs/001-visual-flow-foundation/research.md` - 技术选型验证
  - ✅ `specs/001-visual-flow-foundation/tasks.md` - 任务分解
- **User Stories**: 5 个核心用户故事
  1. 可视化展示 Spec-Kit 文档
  2. 自由布局编辑器
  3. 节点内容展示和编辑
  4. 新增和删除节点
  5. 实时文件系统同步
- **Implementation Phases**: 10 phases, estimated 20-26 work days

## Implementation Status

- [x] Project directory structure created
- [x] Templates created (CLAUDE, spec, plan, tasks)
- [x] Constitution established
- [x] First specification created (001-visual-flow-foundation)
- [x] Implementation plan created (10 phases, 20-26 days)
- [x] Technical research and validation completed
- [x] Task breakdown completed
- [ ] Implementation (Phase 1-10) pending

## Important Reminders

- Always follow SDD process: spec → plan → tasks → implement
- Maintain spec-kit file format compatibility
- All features must align with constitution principles
- Support both English and Chinese documentation

