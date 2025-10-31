# Multi-Agent Execution Plan - Cursor 2.0

**基于**: tasks.md v1.1（最新）  
**执行模式**: 8 个 Cursor Agents 并行开发  
**总任务数**: 52 个（MVP: 38个，P2: 14个）  
**预计总时间**: 
- **MVP**: 8-10 工作日（vs 串行 10-15 天）
- **V1.0（含 P2）**: 10-13 工作日（vs 串行 12-18 天）

---

## 🎯 Agent 分工策略（更新）

### 核心原则
1. **文件边界清晰**：每个 Agent 只修改指定目录，避免冲突
2. **接口优先**：Wave 1 定义所有接口，Wave 2+ 并行开发
3. **依赖管理**：使用 git worktrees 隔离，按 Wave 分批执行
4. **P2 功能可选**：优先完成 MVP，P2 功能根据进度决定

---

## 📊 Wave 执行计划（更新）

### Wave 1: 基础设施（串行，1-2 天）

**Agent-1 独立执行** → 完成后触发 Wave 2  
**任务数**: 5 个

---

### Wave 2: 核心服务层（并行，3-4 天）

**3 个 Agents 并行**：Agent-2（Markdown 适配）, Agent-3（SpecKit 识别 + 集成）, Agent-6（Tauri 完整）  
**任务数**: 13 个（Agent-2: 4个，Agent-3: 4个，Agent-6: 7个）

---

### Wave 3: UI 和功能层（并行，3-4 天）

**3 个 Agents 并行**：Agent-4（卡片 + 节点管理）, Agent-5（TipTap）, Agent-7（布局）  
**任务数**: 18 个（Agent-4: 10个，Agent-5: 5个，Agent-7: 3个）

---

### Wave 4: 集成、优化和文档（串行，2-3 天）

**Agent-8 独立执行**：集成、性能优化、测试、文档  
**任务数**: 14 个

---

## 🤖 Agent 详细分工（基于 tasks.md v1.1）

### Agent-1: 基础设施搭建（Wave 1）⭐ P0

**分支**: `feature/agent-1-foundation`  
**文件范围**: 
- `/`（根目录配置文件）
- `/docs/`（分析文档）
- 不修改 `src/` 下的任何代码文件

**任务**: Phase 1 全部（5 个任务）
- ✅ Task 1.1: Fork flowgram.ai 项目
- ✅ Task 1.2: 安装依赖并运行
- ✅ Task 1.3: 研究项目结构 → 输出 `docs/flowgram-analysis.md`
- ✅ Task 1.4: 创建扩展目录结构
- ✅ Task 1.5: 安装扩展依赖

**预计时间**: 1-2 天

**Checkpoint**:
- [ ] flowgram.ai 项目能正常运行
- [ ] docs/flowgram-analysis.md 已完成（节点格式、组件路径、扩展点）
- [ ] 所有扩展依赖已安装（unified, remark, tiptap）
- [ ] 目录结构已创建

**完成后**: 触发 Wave 2（Agent-2, Agent-3, Agent-6 并行启动）

---

### Agent-2: Markdown 适配层（Wave 2）⭐ P1

**分支**: `feature/agent-2-markdown-adapter`  
**文件范围**:
- `src/adapters/**/*`
- `src/types/markdown.ts`
- `src/adapters/__tests__/**/*`

**任务**: Phase 2 部分（4 个任务）
- ✅ Task 2.1: 定义类型和接口
- ✅ Task 2.2: 实现 Markdown 解析（Markdown → AST）
- ✅ Task 2.3: 实现 AST → flowgram 节点转换
- ✅ Task 2.4: 实现 flowgram 节点 → Markdown 转换
- ✅ Task 2.6: 编写往返测试

**预计时间**: 3-4 天

**依赖**: Agent-1 的 `docs/flowgram-analysis.md`（节点数据格式）

**Checkpoint**:
- [ ] Markdown ↔ flowgram 节点双向转换
- [ ] 往返测试通过（无信息丢失）
- [ ] 单元测试覆盖率 > 90%

---

### Agent-3: SpecKit 识别器 + 集成（Wave 2）⭐ P1

**分支**: `feature/agent-3-speckit-integration`  
**文件范围**:
- `src/speckit/**/*`
- `src/types/speckit.ts`
- `src/App.tsx`（Task 2.7 集成）
- `src/speckit/__tests__/**/*`

**任务**: Phase 2 部分（4 个任务）
- ✅ Task 2.5: 实现 SpecKit 识别器（7 种模式识别）
  - 用户故事、验收场景、功能性需求、成功标准、边界情况、任务、优先级
- ✅ Task 2.7: 集成到 flowgram.ai 应用
  - 添加"打开 Markdown 文件"功能
  - 整合 Markdown Adapter + SpecKit Recognizer
  - 显示解析后的节点

**预计时间**: 2-3 天

**依赖**: Agent-2 的 Markdown Adapter

**Checkpoint**:
- [ ] 识别所有 spec-kit 模式（7 种）
- [ ] 能够打开 spec.md 并显示在 flowgram.ai 画布
- [ ] spec-kit 元数据正确识别（优先级、故事编号等）

---

### Agent-4: 卡片扩展 + 节点管理（Wave 3）⭐ P1 + P2

**分支**: `feature/agent-4-card-and-crud`  
**文件范围**:
- `src/components/Node.tsx`
- `src/components/Node.module.css`
- `src/components/ContextMenu.tsx`
- `src/components/AddNodeDialog.tsx`
- `src/components/DeleteNodeDialog.tsx`
- `src/hooks/useDragReorder.ts`
- `src/components/__tests__/**/*`

**任务**: Phase 3（4个）+ Phase 3.5（6个）= 10 个任务
- ✅ Task 3.1: 扩展卡片节点组件（优先级徽章、元数据）
- ✅ Task 3.2: 实现优先级徽章样式
- ✅ Task 3.3: 实现标题 inline 编辑
- ✅ Task 3.4: 实现节点折叠/展开功能 ⭐
- ✅ Task 3.5.1: 扩展 Markdown Adapter 支持节点 CRUD
- ✅ Task 3.5.2: 实现右键上下文菜单
- ✅ Task 3.5.3: 实现新增节点对话框
- ✅ Task 3.5.4: 实现删除节点功能
- ✅ Task 3.5.5: 实现节点拖拽重排序
- ✅ Task 3.5.6: 集成节点管理功能到应用

**预计时间**: 3-4 天

**依赖**: 
- Agent-1 完成
- Agent-2 的 Markdown Adapter（用于 CRUD 操作）
- Agent-3 的 spec-kit 类型

**Checkpoint**:
- [ ] 卡片展示丰富信息（图标、优先级、预览、元数据）
- [ ] 标题 inline 编辑 + 节点折叠/展开正常
- [ ] 右键菜单、新增/删除节点正常
- [ ] 拖拽重排序正常
- [ ] Markdown 往返测试通过

---

### Agent-5: TipTap 富文本编辑器（Wave 3）⭐ P1

**分支**: `feature/agent-5-tiptap-editor`  
**文件范围**:
- `src/components/RichTextEditor/**/*`
- `src/components/PropertiesPanel.tsx`
- `src/hooks/useAutoSave.ts`
- `src/components/RichTextEditor/__tests__/**/*`

**任务**: Phase 4 全部（5 个任务）
- ✅ Task 4.1: 实现 TipTap 编辑器组件
- ✅ Task 4.2: 实现编辑器工具栏
- ✅ Task 4.3: 扩展 flowgram.ai PropertiesPanel
- ✅ Task 4.4: 实现自动保存
- ✅ Task 4.5: 编写 TipTap 往返测试

**预计时间**: 3 天

**依赖**: 
- Agent-1 完成（TipTap 依赖已安装）
- Agent-2 的 Markdown Adapter（用于保存）

**Checkpoint**:
- [ ] TipTap 编辑器集成到配置面板
- [ ] 工具栏所有按钮正常工作
- [ ] 富文本 ↔ Markdown 双向转换无损
- [ ] 自动保存功能正常

---

### Agent-6: Tauri 桌面化（Wave 2）⭐ P1 + P2

**分支**: `feature/agent-6-tauri-complete`  
**文件范围**:
- `src-tauri/**/*`
- `src/services/fileSystem.ts`
- `src/components/ConflictDialog.tsx`
- `src/hooks/useConflictDetection.ts`
- `src/hooks/useAIGenerationDetection.ts`

**任务**: Phase 5 全部（7 个任务）
- ✅ Task 5.1: 初始化 Tauri 配置
- ✅ Task 5.2: 实现文件系统命令（Rust）
- ✅ Task 5.3: 实现文件监听服务（Rust）
- ✅ Task 5.4: 前端集成 Tauri API
- ✅ Task 5.5: 实现编辑循环避免 ⭐
- ✅ Task 5.6: 实现编辑冲突检测 ⭐ P2
- ✅ Task 5.7: 实现 AI 生成状态检测 ⭐ P2

**预计时间**: 3-4 天

**依赖**: Agent-1 完成

**Checkpoint**:
- [ ] Tauri 桌面应用正常运行
- [ ] 文件读写和监听正常
- [ ] 无编辑循环问题
- [ ] 编辑冲突检测正常（显示冲突对话框）
- [ ] AI 生成状态检测正常（节点显示动画）

---

### Agent-7: 思维导图布局算法（Wave 3）⭐ P1

**分支**: `feature/agent-7-mindmap-layout`  
**文件范围**:
- `src/layouts/**/*`
- `src/utils/layout.ts`（可能需要扩展 flowgram.ai）
- `src/layouts/__tests__/**/*`
- `docs/layout-analysis.md`

**任务**: Phase 6 全部（3 个任务）
- ✅ Task 6.1: 分析 flowgram.ai 布局算法
- ✅ Task 6.2: 实现思维导图布局算法（从左到右）
- ✅ Task 6.3: 集成到 flowgram.ai 布局引擎

**预计时间**: 1-2 天

**依赖**: 
- Agent-1 完成
- Agent-2 的节点数据格式

**Checkpoint**:
- [ ] 思维导图布局算法实现
- [ ] 节点从左到右排列
- [ ] 层级关系清晰
- [ ] 集成到 flowgram.ai

---

### Agent-8: 集成、性能优化和文档（Wave 4）⭐ P1

**分支**: `feature/agent-8-integration-final`  
**文件范围**:
- `src/App.tsx`（最终集成）
- `src/hooks/useVirtualization.ts`
- `tests/**/*`（所有测试）
- `e2e/**/*`（E2E 测试）
- `docs/**/*`（所有文档）
- `README.md`

**任务**: Phase 7（3个）+ Phase 8（5个）= 8 个任务
- ✅ Task 7.1: 实现虚拟化渲染
- ✅ Task 7.2: 优化 React 渲染
- ✅ Task 7.3: 性能测试
- ✅ Task 8.1: 编写单元测试
- ✅ Task 8.2: 编写集成测试
- ✅ Task 8.3: 编写 E2E 测试
- ✅ Task 8.4: 编写用户文档
- ✅ Task 8.5: 编写技术文档

**预计时间**: 2-3 天

**依赖**: 所有 Wave 2-3 Agents 完成

**Checkpoint**:
- [ ] 所有模块集成成功
- [ ] 所有测试通过（覆盖率 > 80%）
- [ ] 性能指标达标
- [ ] 文档完整


---

## 📝 Cursor Agent 提示词

### 🚀 Wave 1: Agent-1 启动提示词

```markdown
你是 Agent-1，负责 Spec-Kit Flow 项目的基础设施搭建。

## 任务目标
完成 Phase 1 的所有任务（Task 1.1 ~ 1.5），为其他 7 个 Agents 准备开发环境。

## 上下文文档
- Constitution: @memory/constitution.md
- Specification: @specs/001-visual-flow-foundation/spec.md
- Implementation Plan: @specs/001-visual-flow-foundation/plan.md
- Task List: @specs/001-visual-flow-foundation/tasks.md

## 具体任务

### Task 1.1: Fork flowgram.ai 项目
1. 访问 https://github.com/bytedance/flowgram.ai
2. Fork 到我的 GitHub 账户
3. 克隆到本地：
   ```bash
   git clone https://github.com/[YOUR-ACCOUNT]/flowgram.ai.git
   cd flowgram.ai/apps/demo-free-layout
   ```

### Task 1.2: 安装并运行
```bash
npm install
npm run dev
```
验证：浏览器打开应用，能够创建节点、拖拽、编辑配置面板

### Task 1.3: 研究 flowgram.ai 项目结构
深入分析：
1. 节点数据格式（查找 types/node.ts 或类似文件）
2. 配置面板组件（PropertiesPanel.tsx）
3. 布局算法（layout.ts）
4. 数据保存/加载（storage.ts 或 localStorage）

输出文档：`docs/flowgram-analysis.md`，必须包含：
- 节点接口定义（id、type、position、data、children）
- 配置面板 props 和扩展方式
- 布局算法接口
- 数据序列化格式

### Task 1.4: 创建扩展目录
```bash
cd src
mkdir -p adapters
mkdir -p speckit
mkdir -p components/RichTextEditor
```

### Task 1.5: 安装扩展依赖
```bash
npm install unified remark-parse remark-stringify remark-gfm
npm install mdast-util-to-string unist-util-visit
npm install @tiptap/react @tiptap/starter-kit tiptap-markdown
npm install use-debounce
```

## 验收标准（Checkpoint）
- [ ] flowgram.ai 原始项目能正常运行
- [ ] docs/flowgram-analysis.md 已创建（完整记录节点格式和组件结构）
- [ ] 扩展目录已创建
- [ ] 所有依赖已安装（npm run dev 无报错）

## 完成后
提交到 feature/agent-1-foundation 分支，创建 PR，并通知：
"Wave 1 完成，Agent-2, Agent-3, Agent-6 可以开始 Wave 2"
```

---

### 🔵 Wave 2: Agent-2 提示词（并行执行）

```markdown
你是 Agent-2，负责 Markdown 适配层的实现。

## 上下文
- Constitution: @memory/constitution.md
- Spec: @specs/001-visual-flow-foundation/spec.md
- Plan: @specs/001-visual-flow-foundation/plan.md  
- Tasks: @specs/001-visual-flow-foundation/tasks.md（Phase 2，Task 2.1-2.4, 2.6）
- flowgram.ai 分析: @docs/flowgram-analysis.md（必读）

## 分支
feature/agent-2-markdown-adapter

## 文件边界（只能修改这些文件）⚠️
✅ 允许修改:
- src/adapters/**/*
- src/types/markdown.ts
- src/adapters/__tests__/**/*

❌ 禁止修改:
- flowgram.ai 核心组件
- src/components/**（其他 Agent 负责）
- src/speckit/**（Agent-3 负责）

## 任务列表（5 个任务）

参考 @specs/001-visual-flow-foundation/tasks.md：
- Task 2.1: 定义类型和接口
- Task 2.2: 实现 Markdown 解析
- Task 2.3: 实现 AST → flowgram 节点转换
- Task 2.4: 实现 flowgram 节点 → Markdown 转换
- Task 2.6: 编写往返测试

## 核心要求

### 1. 双向转换无损 ⚠️
Markdown → AST → Nodes → AST → Markdown 必须一致（允许格式差异，但语义相同）

### 2. flowgram.ai 节点格式兼容
必须基于 flowgram.ai 的节点接口扩展，不得破坏其数据格式

### 3. 保留 AST 引用
在 node.data.astNodeRef 中保存原始 AST 节点，用于反向转换

## 验收标准（Checkpoint Phase 2 部分）
- [ ] Markdown 能转换为 flowgram 节点
- [ ] 节点能转换回 Markdown
- [ ] 往返测试通过（spec.md 测试文件）
- [ ] 单元测试覆盖率 > 90%

## 提交前检查
- [ ] 所有测试通过（npm run test）
- [ ] TypeScript 编译无错误（npm run build）
- [ ] 仅修改了允许的文件

## 完成后
提交 PR 到 integration/wave-2 分支，标题："[Agent-2] Markdown 适配层"
```

---

### 🟢 Wave 2: Agent-3 提示词（并行执行）

```markdown
你是 Agent-3，负责 SpecKit 识别器实现 + 集成到 App。

## 上下文
- Constitution: @memory/constitution.md
- Spec: @specs/001-visual-flow-foundation/spec.md
- Tasks: @specs/001-visual-flow-foundation/tasks.md（Task 2.5, 2.7）
- flowgram.ai 分析: @docs/flowgram-analysis.md

## 分支
feature/agent-3-speckit-integration

## 文件边界（只能修改这些文件）⚠️
✅ 允许修改:
- src/speckit/**/*
- src/types/speckit.ts
- src/App.tsx（仅 Task 2.7 集成部分）
- src/speckit/__tests__/**/*

❌ 禁止修改:
- src/adapters/**（Agent-2 负责）
- src/components/**（其他 Agent 负责）

## 任务列表（4 个任务）

### Task 2.5: 实现 SpecKit 识别器（更新：7 种模式）

参考 @specs/001-visual-flow-foundation/tasks.md Task 2.5

**模式定义** (`src/speckit/patterns.ts`)：
1. 用户故事：`### 用户故事 N - 标题（优先级：PN）`
2. 验收场景：`#### 验收场景`
3. 功能性需求：`- **FR-001**:`
4. 成功标准：`- **SC-001**:`
5. 边界情况：`### 边界情况`
6. 任务列表：`- [ ] 任务内容`
7. 优先级标记：`（优先级：P1）`

**识别器实现**（src/speckit/SpecKitRecognizer.ts）：
```typescript
export class SpecKitRecognizer {
  recognize(node: SpecKitFlowNode): SpecKitFlowNode
  recognizeAll(nodes: SpecKitFlowNode[]): SpecKitFlowNode[]
}
```

### Task 2.7: 集成到 flowgram.ai 应用

**修改 App.tsx**，添加：
1. "打开 Markdown 文件"按钮
2. 使用 Markdown Adapter（Agent-2 提供）解析文件
3. 使用 SpecKit Recognizer 识别元数据
4. 显示节点到 flowgram.ai 画布

**依赖**: Agent-2 的 Markdown Adapter 必须先完成

## 验收标准（Checkpoint）
- [ ] 识别所有 7 种 spec-kit 模式
- [ ] 能够打开 spec.md 并显示在画布
- [ ] spec-kit 元数据正确（优先级、故事编号等）
- [ ] 单元测试覆盖率 > 85%

## 提交前检查
- [ ] 不依赖 Agent-2 未完成的代码（可以先用 mock）
- [ ] 所有测试通过
- [ ] 仅修改了允许的文件

## 完成后
提交 PR 到 integration/wave-2 分支，标题："[Agent-3] SpecKit 识别器 + 集成"
```

---

### 🟣 Wave 2: Agent-6 提示词（并行执行）

```markdown
你是 Agent-6，负责 Tauri 桌面化（完整版，包含 P2 功能）。

## 上下文
- Constitution: @memory/constitution.md
- Spec: @specs/001-visual-flow-foundation/spec.md
- Tasks: @specs/001-visual-flow-foundation/tasks.md（Phase 5 全部，Task 5.1-5.7）

## 分支
feature/agent-6-tauri-complete

## 文件边界（只能修改这些文件）⚠️
✅ 允许修改:
- src-tauri/**/*
- src/services/fileSystem.ts
- src/components/ConflictDialog.tsx（新建）
- src/hooks/useConflictDetection.ts（新建）
- src/hooks/useAIGenerationDetection.ts（新建）

❌ 禁止修改:
- src/adapters/**（Agent-2）
- src/speckit/**（Agent-3）
- src/components/Node.tsx（Agent-4）
- src/components/RichTextEditor/**（Agent-5）

## 任务列表（7 个任务，含 P2 功能）

参考 @specs/001-visual-flow-foundation/tasks.md Phase 5：

### MVP 任务（P1，4 个）:
- Task 5.1: 初始化 Tauri 配置
- Task 5.2: 实现文件系统命令（Rust）
- Task 5.3: 实现文件监听服务（Rust）
- Task 5.4: 前端集成 Tauri API

### 增强任务（P2，3 个）:
- Task 5.5: 实现编辑循环避免 ⭐
- Task 5.6: 实现编辑冲突检测 ⭐
- Task 5.7: 实现 AI 生成状态检测 ⭐

## 核心要求

### 1. Rust notify crate 文件监听
使用 notify = "6.1"，监听文件变化并发送事件到前端

### 2. 编辑循环避免
使用标志位 `isInternalSave` 区分内部/外部修改

### 3. 编辑冲突检测（P2）
检测：本地有未保存编辑 + 文件被外部修改 → 显示冲突对话框

### 4. AI 生成状态检测（P2）
检测：3 秒内 > 3 次文件变化 → 标记为"AI 生成中"

## 验收标准（Checkpoint Phase 5）
- [ ] Tauri 应用正常运行（npm run tauri dev）
- [ ] 文件读写和监听正常
- [ ] 无编辑循环问题
- [ ] 编辑冲突检测正常（显示冲突对话框，3 种解决方案）
- [ ] AI 生成状态检测正常（节点显示脉冲动画）

## 实施建议
**可选策略**: 如果时间紧张，可以先完成 MVP（Task 5.1-5.4），P2 功能（5.6, 5.7）延后

## 提交前检查
- [ ] Rust 代码编译通过（cargo build）
- [ ] 前端测试通过
- [ ] 仅修改了允许的文件

## 完成后
提交 PR 到 integration/wave-2 分支，标题："[Agent-6] Tauri 桌面化（含 P2 功能）"
```

---

### 🟡 Wave 3: Agent-4 提示词（并行执行）

```markdown
你是 Agent-4，负责卡片节点扩展 + 节点管理功能（P1 + P2）。

## 上下文
- Constitution: @memory/constitution.md
- Spec: @specs/001-visual-flow-foundation/spec.md
- Tasks: @specs/001-visual-flow-foundation/tasks.md（Phase 3 全部 + Phase 3.5 全部）
- flowgram.ai 分析: @docs/flowgram-analysis.md

## 分支
feature/agent-4-card-and-crud

## 文件边界（只能修改这些文件）⚠️
✅ 允许修改:
- src/components/Node.tsx
- src/components/Node.module.css
- src/components/ContextMenu.tsx（新建）
- src/components/AddNodeDialog.tsx（新建）
- src/components/DeleteNodeDialog.tsx（新建）
- src/hooks/useDragReorder.ts（新建）
- src/components/__tests__/**/*

❌ 禁止修改:
- src/adapters/**（Agent-2，但需要扩展其 CRUD 方法）
- src/components/RichTextEditor/**（Agent-5）

## 任务列表（10 个任务）

### Phase 3: 卡片扩展（4 个任务）
- Task 3.1: 扩展卡片节点组件（优先级徽章、元数据）
- Task 3.2: 实现优先级徽章样式
- Task 3.3: 实现标题 inline 编辑
- Task 3.4: 实现节点折叠/展开功能 ⭐

### Phase 3.5: 节点管理（6 个任务，P2 功能）
- Task 3.5.1: 扩展 Markdown Adapter 支持节点 CRUD
- Task 3.5.2: 实现右键上下文菜单
- Task 3.5.3: 实现新增节点对话框
- Task 3.5.4: 实现删除节点功能（含级联删除）
- Task 3.5.5: 实现节点拖拽重排序
- Task 3.5.6: 集成节点管理功能到应用

## 核心要求

### 1. 扩展 Markdown Adapter（Task 3.5.1）
虽然 Adapter 属于 Agent-2，但需要你添加 CRUD 方法：
- `insertNode(parentId, type, title, priority)` 
- `deleteNode(nodeId)` 
- `moveNode(nodeId, newParentId, newIndex)`

**协调方式**: 在 Agent-2 完成基础 Adapter 后，扩展其方法

### 2. 标题 inline 编辑（Task 3.3）
悬停显示 ✏️，单击进入编辑模式，需要与右侧编辑器同步

### 3. 折叠/展开（Task 3.4）
复用 flowgram.ai 的布局保存逻辑，持久化折叠状态

### 4. 节点 CRUD 完整流程（Phase 3.5）
右键菜单 → 对话框 → Markdown Adapter → 保存文件 → 刷新流程图

## 验收标准（Checkpoint Phase 3 + 3.5）
- [ ] 卡片展示丰富信息
- [ ] 标题 inline 编辑 + 节点折叠/展开正常
- [ ] 右键菜单、新增/删除节点正常
- [ ] 拖拽重排序正常
- [ ] Markdown 往返测试通过（含 CRUD 操作）

## 实施建议
**可选策略**: 可以先完成 Phase 3（4个任务），Phase 3.5（P2）根据进度决定

## 提交前检查
- [ ] 所有测试通过
- [ ] 不破坏 flowgram.ai 原有功能
- [ ] 仅修改了允许的文件

## 完成后
提交 PR 到 integration/wave-3 分支，标题："[Agent-4] 卡片扩展 + 节点管理"
```

---

### 🟠 Wave 3: Agent-5 提示词（并行执行）

```markdown
你是 Agent-5，负责 TipTap 富文本编辑器的实现和集成。

## 上下文
- Constitution: @memory/constitution.md
- Spec: @specs/001-visual-flow-foundation/spec.md
- Tasks: @specs/001-visual-flow-foundation/tasks.md（Phase 4 全部，Task 4.1-4.5）

## 分支
feature/agent-5-tiptap-editor

## 文件边界（只能修改这些文件）⚠️
✅ 允许修改:
- src/components/RichTextEditor/**/*（新建目录）
- src/components/PropertiesPanel.tsx（扩展 flowgram.ai 组件）
- src/hooks/useAutoSave.ts（新建）
- src/components/RichTextEditor/__tests__/**/*

❌ 禁止修改:
- src/components/Node.tsx（Agent-4）
- src/adapters/**（Agent-2）
- flowgram.ai 其他核心组件

## 任务列表（5 个任务）

参考 @specs/001-visual-flow-foundation/tasks.md Phase 4：
- Task 4.1: 实现 TipTap 编辑器组件
- Task 4.2: 实现编辑器工具栏（[B][I][H▼][•][1.][<>][""]）
- Task 4.3: 扩展 flowgram.ai PropertiesPanel
- Task 4.4: 实现自动保存（1 秒防抖）
- Task 4.5: 编写 TipTap 往返测试

## 核心要求

### 1. TipTap Markdown 扩展
使用 `tiptap-markdown`，确保 Markdown ↔ 富文本双向转换无损

### 2. 集成到 flowgram.ai 配置面板
扩展 PropertiesPanel.tsx，检测 spec-kit 节点 → 显示 TipTap，否则显示原编辑器

### 3. 工具栏面向非技术人员
所有格式化操作通过工具栏按钮，无需了解 Markdown 语法

### 4. 自动保存
编辑停止 1 秒后自动保存，显示"已保存"提示

## 验收标准（Checkpoint Phase 4）
- [ ] TipTap 编辑器集成到配置面板
- [ ] 工具栏所有按钮正常工作
- [ ] 富文本 ↔ Markdown 双向转换无损
- [ ] 自动保存功能正常
- [ ] 测试覆盖率 > 80%

## 提交前检查
- [ ] 所有测试通过
- [ ] 不破坏 flowgram.ai 原有配置面板功能
- [ ] 仅修改了允许的文件

## 完成后
提交 PR 到 integration/wave-3 分支，标题："[Agent-5] TipTap 富文本编辑器"
```

---

### 🔶 Wave 3: Agent-7 提示词（并行执行）

```markdown
你是 Agent-7，负责思维导图布局算法。

## 上下文
- Constitution: @memory/constitution.md
- Spec: @specs/001-visual-flow-foundation/spec.md
- Tasks: @specs/001-visual-flow-foundation/tasks.md（Phase 6 全部，Task 6.1-6.3）
- flowgram.ai 分析: @docs/flowgram-analysis.md

## 分支
feature/agent-7-mindmap-layout

## 文件边界（只能修改这些文件）⚠️
✅ 允许修改:
- src/layouts/**/*（新建目录）
- src/utils/layout.ts（可能需要扩展 flowgram.ai）
- docs/layout-analysis.md（新建）
- src/layouts/__tests__/**/*

❌ 禁止修改:
- src/components/**（其他 Agent）
- src/adapters/**（Agent-2）

## 任务列表（3 个任务）

参考 @specs/001-visual-flow-foundation/tasks.md Phase 6：
- Task 6.1: 分析 flowgram.ai 布局算法 → 输出 docs/layout-analysis.md
- Task 6.2: 实现思维导图布局算法（从左到右，层级间距 300px）
- Task 6.3: 集成到 flowgram.ai 布局引擎

## 核心要求

### 1. 从左到右布局
- X 轴：层级（根节点 x=0，子节点 x=300, 400, ...）
- Y 轴：同级节点间距 80px
- 使用平滑曲线连接父子节点

### 2. 避免重叠
检测同级节点重叠，自动调整 Y 坐标

### 3. 兼容 flowgram.ai
可能需要添加布局模式选项，默认使用思维导图布局

## 验收标准（Checkpoint Phase 6）
- [ ] 节点从左到右排列
- [ ] 层级关系清晰
- [ ] 无节点重叠
- [ ] 集成到 flowgram.ai（或作为新的布局模式）

## 提交前检查
- [ ] 布局算法单元测试通过
- [ ] 不破坏 flowgram.ai 原有布局
- [ ] 仅修改了允许的文件

## 完成后
提交 PR 到 integration/wave-3 分支，标题："[Agent-7] 思维导图布局算法"
```

---

### 🔴 Wave 4: Agent-8 提示词（最后执行）

```markdown
你是 Agent-8，负责最终集成、性能优化、测试和文档。

## 上下文
- Constitution: @memory/constitution.md
- Spec: @specs/001-visual-flow-foundation/spec.md
- Tasks: @specs/001-visual-flow-foundation/tasks.md（Task 2.7 + Phase 7-8）

## 分支
feature/agent-8-integration-final

## 前置条件（必须全部完成）⚠️
- ✅ Wave 2 完成：Agent-2 ✓, Agent-3 ✓, Agent-6 ✓
- ✅ Wave 3 完成：Agent-4 ✓, Agent-5 ✓, Agent-7 ✓
- ✅ 所有分支已合并到 integration/wave-3

## 文件边界（可以修改任何文件进行集成）
✅ 允许修改:
- src/App.tsx（最终集成）
- src/hooks/useVirtualization.ts（新建）
- tests/**/*（所有测试）
- e2e/**/*（E2E 测试）
- docs/**/*（所有文档）
- README.md

## 任务列表（8 个任务）

### Phase 7: 性能优化（3 个任务）
- Task 7.1: 实现虚拟化渲染
- Task 7.2: 优化 React 渲染（React.memo, useCallback, 懒加载）
- Task 7.3: 性能测试

### Phase 8: 测试和文档（5 个任务）
- Task 8.1: 编写单元测试
- Task 8.2: 编写集成测试
- Task 8.3: 编写 E2E 测试（Playwright）
- Task 8.4: 编写用户文档（user-guide.md）
- Task 8.5: 编写技术文档（architecture.md, flowgram-integration.md）

## 核心要求

### 1. 最终集成（整合所有模块）
- Markdown Adapter（Agent-2）
- SpecKit Recognizer（Agent-3）
- 卡片节点（Agent-4）
- TipTap 编辑器（Agent-5）
- Tauri 文件系统（Agent-6）
- 思维导图布局（Agent-7）

### 2. 性能优化
- 虚拟化渲染（仅渲染可见区域，支持 500+ 节点）
- React 性能优化（避免不必要的重渲染）
- 确保所有性能指标达标

### 3. 测试完整性
- 单元测试覆盖率 > 80%
- 集成测试覆盖完整流程
- E2E 测试覆盖用户旅程

### 4. 文档完整性
- 用户指南（快速开始、功能说明、快捷键）
- 技术文档（架构、flowgram.ai 集成、Markdown 适配器）

## 验收标准（Final Checkpoint）
- [ ] 完整流程测试通过（打开 → 显示 → 编辑 → 保存）
- [ ] 所有单元测试通过（覆盖率 > 80%）
- [ ] 所有集成测试通过
- [ ] 所有 E2E 测试通过
- [ ] 性能指标全部达标（解析 < 100ms，渲染 < 2s，60fps）
- [ ] 用户文档和技术文档完整

## 合并冲突处理
如果遇到合并冲突：
1. 优先保留 flowgram.ai 原有功能
2. 与相关 Agent 沟通协调（通过 PR 评论）
3. 确保集成后所有测试通过

## 提交前检查
- [ ] 所有测试通过
- [ ] TypeScript 编译无错误
- [ ] npm run build 成功
- [ ] npm run tauri build 成功（跨平台打包）

## 完成后
提交 PR 到 main 分支，标题："[Release] Visual Flow Foundation MVP v1.0"
```

---

## 🎬 执行时间线（基于 tasks.md v1.1）

### Day 1-2: Wave 1（串行）
```
[Agent-1] ████████ Foundation（5 个任务）
   ↓ Checkpoint ✅
```

### Day 3-6: Wave 2（3 个 Agents 并行）
```
[Agent-2] ████████████ Markdown 适配（5 个任务，3-4 天）
[Agent-3] ██████████   SpecKit 识别 + 集成（4 个任务，2-3 天）
[Agent-6] ████████████ Tauri 完整版（7 个任务，3-4 天，含 P2）
   ↓ Checkpoint ✅（合并到 integration/wave-2）
```

### Day 7-10: Wave 3（3 个 Agents 并行）
```
[Agent-4] ████████████ 卡片 + 节点管理（10 个任务，3-4 天，含 P2）
[Agent-5] ██████████   TipTap 编辑器（5 个任务，3 天）
[Agent-7] ████████     思维导图布局（3 个任务，1-2 天）
   ↓ Checkpoint ✅（合并到 integration/wave-3）
```

### Day 11-13: Wave 4（串行）
```
[Agent-8] ██████████ 集成 + 性能 + 测试 + 文档（8 个任务，2-3 天）
   ↓ Final Checkpoint ✅
```

**总计**: 
- **MVP（跳过 P2 功能）**: 8-10 工作日
- **V1.0（含 P2 功能）**: 11-13 工作日（vs 串行 15-18 天，节省 30%）

---

## 📋 执行检查清单（完整版）

### ✅ STEP 0: 准备工作
- [ ] 用户确认 tasks.md v1.1
- [ ] 创建主分支：`main`
- [ ] 创建集成分支：`integration/wave-2`, `integration/wave-3`, `integration/wave-4`

---

### 🚀 STEP 1: 启动 Wave 1（Day 1-2）
- [ ] 创建分支：`feature/agent-1-foundation`
- [ ] 启动 Agent-1（使用上面的提示词）
- [ ] 等待 Checkpoint 完成：
  - [ ] flowgram.ai 项目正常运行
  - [ ] docs/flowgram-analysis.md 已完成
  - [ ] 所有依赖已安装
- [ ] 合并到 `integration/wave-2` 分支

---

### 🚀 STEP 2: 启动 Wave 2（Day 3-6，3 个 Agents 并行）

**使用 Cursor Multi-Agents**：
1. 选择 integration/wave-2 分支作为基础
2. 同时启动 3 个 Agents（使用 git worktrees 隔离）

- [ ] 创建分支：`feature/agent-2-markdown-adapter`
  - [ ] 启动 Agent-2（使用上面的提示词）
  
- [ ] 创建分支：`feature/agent-3-speckit-integration`
  - [ ] 启动 Agent-3（使用上面的提示词）
  - [ ] 注意：Agent-3 依赖 Agent-2 的类型定义
  
- [ ] 创建分支：`feature/agent-6-tauri-complete`
  - [ ] 启动 Agent-6（使用上面的提示词）
  - [ ] 可选：先完成 MVP（Task 5.1-5.4），P2（5.5-5.7）延后

- [ ] 等待所有 Agent 完成 Checkpoint
- [ ] 合并所有分支到 `integration/wave-3`
- [ ] 解决合并冲突（如果有）
- [ ] 运行集成测试

---

### 🚀 STEP 3: 启动 Wave 3（Day 7-10，3 个 Agents 并行）

**基于 integration/wave-3 分支**：

- [ ] 创建分支：`feature/agent-4-card-and-crud`
  - [ ] 启动 Agent-4（使用上面的提示词）
  - [ ] 10 个任务（Phase 3 + Phase 3.5）
  - [ ] 可选：先完成 Phase 3（4个），Phase 3.5（P2）延后
  
- [ ] 创建分支：`feature/agent-5-tiptap-editor`
  - [ ] 启动 Agent-5（使用上面的提示词）
  - [ ] 5 个任务
  
- [ ] 创建分支：`feature/agent-7-mindmap-layout`
  - [ ] 启动 Agent-7（使用上面的提示词）
  - [ ] 3 个任务

- [ ] 等待所有 Agent 完成 Checkpoint
- [ ] 合并所有分支到 `integration/wave-4`
- [ ] 解决合并冲突
- [ ] 运行集成测试

---

### 🚀 STEP 4: 启动 Wave 4（Day 11-13，串行）

**基于 integration/wave-4 分支**：

- [ ] 创建分支：`feature/agent-8-integration-final`
- [ ] 启动 Agent-8（使用上面的提示词）
- [ ] 8 个任务（集成 + 性能 + 测试 + 文档）
- [ ] 等待 Final Checkpoint 完成
- [ ] 创建 PR 到 `main` 分支
- [ ] Code Review
- [ ] 合并到 `main`，发布 v1.0

---

## 📊 任务分配汇总

| Agent | Wave | 任务数 | Phase | 文件范围 | 时间 | 优先级 |
|-------|------|-------|-------|---------|------|--------|
| Agent-1 | Wave 1 | 5 | Phase 1 | /根目录, /docs | 1-2天 | P0 |
| Agent-2 | Wave 2 | 5 | Phase 2 部分 | src/adapters/ | 3-4天 | P1 |
| Agent-3 | Wave 2 | 4 | Phase 2 部分 | src/speckit/, src/App.tsx | 2-3天 | P1 |
| Agent-6 | Wave 2 | 7 | Phase 5 全部 | src-tauri/, src/services/ | 3-4天 | P1+P2 |
| Agent-4 | Wave 3 | 10 | Phase 3+3.5 | src/components/Node.tsx, 对话框 | 3-4天 | P1+P2 |
| Agent-5 | Wave 3 | 5 | Phase 4 全部 | src/components/RichTextEditor/ | 3天 | P1 |
| Agent-7 | Wave 3 | 3 | Phase 6 全部 | src/layouts/ | 1-2天 | P1 |
| Agent-8 | Wave 4 | 8 | Phase 7-8 | src/App.tsx 集成, tests/, docs/ | 2-3天 | P1 |

**总计**: 47 个任务（部分任务在 Agent-8 中完成）

---

## 🎯 实施建议

### 方案 A：快速 MVP（推荐）
**目标**: 最快交付可用版本

**策略**:
- Wave 2: Agent-2, Agent-3 必须完成；Agent-6 仅完成 MVP（Task 5.1-5.4），P2 延后
- Wave 3: Agent-4 仅完成 Phase 3（4个任务），Phase 3.5 延后；Agent-5, Agent-7 全部完成
- Wave 4: Agent-8 聚焦集成和核心测试

**时间**: 8-10 工作日  
**交付**: MVP（可视化 + 富文本编辑 + 基础文件系统）

---

### 方案 B：完整 V1.0
**目标**: 交付完整功能

**策略**:
- 所有 Agents 完成全部任务（包括 P2 功能）
- Phase 3.5（节点管理）
- Phase 5（冲突检测、AI 状态检测）

**时间**: 11-13 工作日  
**交付**: V1.0（完整功能，包含节点 CRUD、冲突处理、AI 集成）

---

## ⚠️ 注意事项

### 文件冲突避免
- 严格遵守文件边界
- Agent-4 扩展 Markdown Adapter 时，与 Agent-2 协调（在其完成后扩展）
- Agent-3 依赖 Agent-2 的类型定义（可以先用 mock）

### Checkpoint 验证
每个 Wave 完成后，必须：
1. 合并所有分支到集成分支
2. 运行所有测试
3. 解决冲突
4. 验证 Checkpoint 标准
5. 才能进入下一个 Wave

### P2 功能决策点
在 Wave 3 开始前，根据 Wave 2 的进度决定：
- 如果进度良好 → 实施 P2 功能（Phase 3.5, Task 5.6-5.7）
- 如果进度紧张 → 跳过 P2，优先交付 MVP

---

**执行计划版本**: v2.0（基于 tasks.md v1.1）  
**最后更新**: 2025-10-31  
**总任务数**: 52 个（MVP: 38个，P2: 14个）  
**状态**: ✅ 已完成，等待用户确认


