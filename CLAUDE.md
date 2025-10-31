# Project Context for AI Agents

## Project Overview

**Spec-Kit Flow** is a visual interface for the Spec-Kit methodology that enables teams to visualize, edit, and manage specifications through an interactive flow-based interface.

## Current Focus

**Phase**: Tasks Confirmation (等待用户确认 tasks.md)
**Active Feature**: 001-visual-flow-foundation
**Core Positioning**: 
- **内容结构可视化**：Markdown 标题层级 → 思维导图节点
- **丰富卡片节点**：FlowGram 卡片形式，展示图标、优先级、元数据、内容预览
- **编辑交互**：
  - 点击卡片 → 右侧面板自动展开（TipTap 富文本编辑器）
  - 悬停标题 → 显示 ✏️ → 单击 → inline 快捷编辑
- **面向非技术人员**：PM、设计师、业务人员都能使用

**Next Step**: 
1. ✅ spec.md v2.0 已确认
2. ✅ plan.md v1.0 已确认
3. ✅ tasks.md v1.0 已编写（40 个任务，8 个阶段）
4. ⏳ **等待用户确认 tasks.md**（任务分解和实施顺序）
5. 确认后 → 开始实施（Phase 1-8）

## Key Decisions

### 核心定位变更 ⚠️
- ❌ **之前**：文件结构可视化（一个文件 = 一个节点）
- ✅ **现在**：**内容结构可视化**（一个标题/段落 = 一个节点）

### 技术栈

#### 基础项目（改造基础）⭐⭐⭐
- **flowgram.ai demo-free-layout**: https://github.com/bytedance/flowgram.ai/tree/main/apps/demo-free-layout
  - ✅ **复用**：节点渲染、配置面板、拖拽交互、布局引擎、保存逻辑
  - ✅ **尊崇**：其架构规范、组件设计、数据格式
  - ⚠️ **禁止**：重新实现已有功能

#### 扩展技术栈（在 flowgram.ai 基础上新增）
1. **Markdown 解析**: unified + remark-parse + remark-stringify
   - 用于：Markdown 文件 ↔ flowgram.ai 节点数据
   
2. **富文本编辑器**: TipTap + tiptap-markdown
   - 集成到 flowgram.ai 配置面板中
   - 所见即所得（WYSIWYG）编辑体验
   
3. **桌面框架**: Tauri 1.5+
   - 文件系统访问和监听
   - 打包为桌面应用

## Active Specifications

### 001-visual-flow-foundation
- **Status**: Ready for Implementation ✅
- **Files**:
  - ✅ `specs/001-visual-flow-foundation/spec.md` - 用户需求规范（基于现有版本）
  - ✅ `specs/001-visual-flow-foundation/plan.md` - 详细实施计划（8 phases，15-20天）
  - ✅ `specs/001-visual-flow-foundation/research.md` - 技术研究（flowgram.ai + Markdown AST）
  - ✅ `specs/001-visual-flow-foundation/tasks.md` - 任务分解（~50个任务）
  
- **核心架构**（三层）:
  1. **Markdown AST 层**: unified/remark 解析和构建
  2. **可视化节点层**: AST ↔ FlowNode 双向转换 + 布局算法
  3. **UI 渲染层**: React + SVG 渲染 + 交互
  
- **Implementation Phases**: 8 phases, 15-20 work days
  - Phase 1: 项目脚手架（1-2天）
  - Phase 2: Markdown AST 层（2-3天）
  - Phase 3: 可视化节点层（2-3天）
  - Phase 4: SVG 渲染和交互（3-4天）
  - Phase 5: 内容编辑和同步（2-3天）
  - Phase 6: 文件系统集成（2天）
  - Phase 7: UI 优化（1-2天）
  - Phase 8: 测试和文档（2-3天）

## Implementation Status

### SDD 流程完成度（严格逐步确认）⚠️

- [x] **STEP 1**: 编写 Specification (spec.md)
  - ✅ 用户提供了初始 spec.md
  - ✅ 基于用户反馈调整核心定位：
    - 内容结构可视化（而非文件结构）
    - 富文本编辑器（而非 Markdown 源码编辑）
    - 基于 flowgram.ai 改造（而非从零实现）
  - ✅ 生成 spec.md v2.0
  
- [x] **STEP 2**: 用户确认 Specification ✅
  - ✅ 8 点关键内容全部确认
  - ✅ spec.md v2.0 最终确认
  
- [x] **STEP 3**: 编写 Implementation Plan (plan.md) ✅
  - ✅ flowgram.ai 集成策略
  - ✅ Markdown 适配器设计
  - ✅ TipTap 集成方案
  - ✅ 8 个实施阶段（10-15 天）
  
- [x] **STEP 4**: 用户确认 Plan ✅
  - ✅ 技术方案已确认
  - ✅ 实施阶段划分已确认（8 个阶段）
  - ✅ 时间估算已确认（10-15 天）
  
- [x] **STEP 5**: 编写 Task Breakdown (tasks.md) ✅
  - ✅ 40 个详细任务
  - ✅ 每个任务包含验收标准
  - ✅ 明确依赖关系和并行可能性
  
- [ ] **STEP 6**: 等待用户确认 Tasks ⏳ **当前阶段**
  - ⏳ 确认任务分解是否合理
  - ⏳ 确认任务粒度是否适当
  - ⏳ 确认验收标准是否清晰
  - ⚠️ **禁止在确认前开始实施**
  
- [ ] **STEP 7**: 实施 (Implementation)
  - ⚠️ 等待 STEP 6 确认后执行

### 核心文档状态
| 文档 | 状态 | 最后更新 | 版本 | 备注 |
|------|------|---------|------|------|
| constitution.md | ✅ 已更新 | 2025-10-31 | v2.1 | 基于 flowgram.ai 改造 + SDD 严格流程 |
| spec.md | ✅ 已确认 | 2025-10-31 | v2.0 | 用户已确认 |
| SPEC-REVIEW.md | ✅ 已完成 | 2025-10-31 | v1.0 | 8 点确认（全部✅） |
| plan.md | ✅ 已确认 | 2025-10-31 | v1.0 | 用户已确认 |
| tasks.md | ✅ 已更新 | 2025-10-31 | v1.1 | 52 任务（MVP: 38, P2: 14）⏳ 待确认 |
| MULTI-AGENT-EXECUTION.md | ✅ 已更新 | 2025-10-31 | v2.0 | 8 Agents，4 Waves，11-13 天 |

## Important Reminders

### 核心定位 ⚠️
- **内容结构可视化**，而非文件结构可视化
- Markdown 文档的标题层级（#、##、###）转换为 FlowGram 节点
- 思维导图式布局（从左到右）
- 双向同步：编辑节点 = 编辑 Markdown 文件

### SDD 严格流程 ⚠️ [[memory:10597274]]
**绝对禁止跳过或提前**：
1. 编写 spec.md
2. **等待用户确认** ✅
3. 编写 plan.md
4. **等待用户确认** ✅
5. 编写 tasks.md
6. **等待用户确认** ✅
7. 开始实施

**当前状态**: 停留在 STEP 2（等待用户确认 spec.md）

**违规教训**：之前错误地一次性生成了 plan.md、tasks.md、research.md，已全部删除并重新开始

### 技术要点

#### 节点卡片设计 [[memory:10597449]]
- **FlowGram 卡片形式**：展示丰富信息的节点卡片
  - 卡片结构：标题栏（图标 + 标题 + 徽章）、内容区（预览）、底栏（元数据）
  - 卡片展示：图标、优先级标记（P1/P2/P3）、状态、字数、修改时间
  - 内容预览：显示前 2-3 行内容摘要
  
#### 编辑交互（简化统一）
- **主要编辑**：点击卡片 → 右侧面板自动展开
  - 富文本编辑器（TipTap）：工具栏按钮操作
  - 编辑完整内容：格式化、长文本、多段落
  - Markdown ↔ 富文本双向转换（对用户透明）
  
- **标题快捷编辑**（可选）：悬停标题 → 显示 ✏️ → 单击 → inline 编辑
  - 适用：仅快速修改标题
  - 保存：Enter 键或失焦

#### 核心技术 [[memory:10597527]]
- **flowgram.ai demo-free-layout**（改造基础）⭐
  - ✅ 复用：节点渲染、配置面板、拖拽、布局、保存逻辑
  - ✅ 尊崇：其架构规范和设计模式
  - ⚠️ 禁止：重新实现已有功能
  
- **Markdown 适配层**（新增）
  - unified/remark：Markdown AST 解析和构建
  - 适配器：Markdown AST ↔ flowgram.ai 节点格式
  
- **TipTap**（集成到 flowgram.ai 配置面板）
  - 富文本编辑器：替换或扩展 flowgram.ai 原有编辑器
  - Markdown ↔ 富文本双向转换

### 下一步（严格按 SDD 流程）

**当前阶段：STEP 2 - 等待用户确认 Specification**

需要用户确认的关键点：

### 1. 核心定位 ✅ 已确认
**内容结构可视化**：
- Markdown 标题层级（#、##、###）→ 思维导图节点
- 从左到右布局（类似思维导图）

### 2. 节点展示形式 ✅ 已确认
**丰富的卡片节点**（flowgram.ai 风格）

### 3. 编辑交互体验 ✅ 已确认
- **点击卡片** → 右侧面板自动展开（TipTap 富文本编辑器）
- **悬停标题** → 显示 ✏️ → 单击 → inline 快捷编辑

### 4. 富文本编辑器 ✅ 已确认
- **TipTap**：所见即所得，面向非技术人员

### 5. 用户故事优先级 ✅ 已确认
- P1（MVP）：可视化 + 编辑

### 6. 性能要求 ✅ 已确认
- 解析 < 100ms，渲染 < 2s，60fps

### 7. 技术实现策略 ⏳ 需确认
- **基于 flowgram.ai demo-free-layout 改造**（不从零实现）
- 复用：节点渲染、配置面板、拖拽、布局、保存逻辑
- 扩展：Markdown 适配、spec-kit 识别、TipTap 集成

### 8. 范围边界 ⏳ 需确认
- 范围内：改造扩展 flowgram.ai
- 范围外：多用户协作、Git、云存储、移动端

---

**确认点 7 和 8 后，进入 STEP 3（编写 plan.md）**

