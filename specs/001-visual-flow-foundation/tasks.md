# Visual Flow Foundation - 任务分解

**基于**: plan.md v1.1（已确认）  
**创建时间**: 2025-10-31  
**最后更新**: 2025-10-31  
**总任务数**: 约 52 个任务（MVP: 38 个，P2: 14 个）  
**预计工期**: 
- **MVP（P1 功能）**: 10-15 工作日
- **完整 V1.0（P1 + P2）**: 12-18 工作日

本文档将实施计划分解为具体的、可执行的任务，每个任务包含明确的验收标准。

---

## Phase 1: 项目准备和 flowgram.ai 集成（2-3 天）

### 前置条件
- [x] spec.md v2.0 已确认
- [x] plan.md v1.0 已确认
- [ ] Git 已安装
- [ ] Node.js 18+ 已安装
- [ ] 能够访问 GitHub

---

### Task 1.1: Fork flowgram.ai 项目
**类型**: Configuration  
**优先级**: P0（阻塞所有后续任务）

**步骤**:
1. 访问 https://github.com/bytedance/flowgram.ai
2. Fork 项目到我们的 GitHub 账户
3. 克隆到本地：
   ```bash
   git clone https://github.com/[your-account]/flowgram.ai.git
   cd flowgram.ai/apps/demo-free-layout
   ```

**验收标准**:
- [ ] flowgram.ai 项目已 Fork 到我们的账户
- [ ] demo-free-layout 目录已克隆到本地
- [ ] 能够访问源码

---

### Task 1.2: 安装依赖并运行原始项目
**类型**: Configuration  
**依赖**: Task 1.1

**步骤**:
```bash
cd flowgram.ai/apps/demo-free-layout
npm install
npm run dev
```

**验收标准**:
- [ ] 所有依赖安装成功（无错误）
- [ ] `npm run dev` 启动开发服务器
- [ ] 浏览器打开应用，能够正常使用
- [ ] 能够创建节点、拖拽、编辑配置面板

---

### Task 1.3: 研究 flowgram.ai 项目结构
**类型**: Research  
**依赖**: Task 1.2

**研究内容**:
1. **节点数据格式**：
   - 查找 `types/node.ts` 或类似文件
   - 记录节点接口定义（id、type、position、data、children）
   
2. **配置面板组件**：
   - 查找 `PropertiesPanel.tsx` 或类似组件
   - 理解其 props 和渲染逻辑
   
3. **布局算法**：
   - 查找 `layout.ts` 或类似文件
   - 理解布局计算方式
   
4. **数据保存/加载**：
   - 查找 `storage.ts` 或 localStorage 相关代码
   - 理解数据序列化格式

**输出**: 创建文档 `docs/flowgram-analysis.md`，记录：
- 节点数据格式
- 关键组件路径
- 可扩展点

**验收标准**:
- [ ] 理解节点数据格式（能画出数据结构图）
- [ ] 找到配置面板组件文件
- [ ] 找到布局算法代码
- [ ] 找到数据保存逻辑
- [ ] 创建分析文档

---

### Task 1.4: 创建扩展目录结构
**类型**: Implementation  
**依赖**: Task 1.2

**步骤**:
```bash
cd flowgram.ai/apps/demo-free-layout/src
mkdir -p adapters
mkdir -p speckit
mkdir -p components/RichTextEditor
```

**验收标准**:
- [ ] `src/adapters/` 目录已创建
- [ ] `src/speckit/` 目录已创建
- [ ] `src/components/RichTextEditor/` 目录已创建

---

### Task 1.5: 安装扩展依赖
**类型**: Configuration  
**依赖**: Task 1.2

**步骤**:
```bash
# Markdown 处理
npm install unified remark-parse remark-stringify remark-gfm
npm install mdast-util-to-string unist-util-visit

# 富文本编辑器
npm install @tiptap/react @tiptap/starter-kit tiptap-markdown

# 工具库
npm install use-debounce
```

**验收标准**:
- [ ] 所有依赖安装成功
- [ ] `package.json` 包含所有新依赖
- [ ] `npm run dev` 仍然能正常启动（无冲突）

---

### Checkpoint - Phase 1
- [ ] flowgram.ai 原始项目能正常运行
- [ ] 理解其节点数据格式和关键组件
- [ ] 扩展目录结构已创建
- [ ] 所有新依赖已安装
- [ ] 分析文档已完成

---

## Phase 2: Markdown 适配层实现（3-4 天）

### Task 2.1: 定义类型和接口
**类型**: Implementation  
**文件**: `src/types/markdown.ts`, `src/types/speckit.ts`

**代码**:
```typescript
// src/types/markdown.ts
export type { Root, Heading, Paragraph, List } from 'mdast'

// src/types/speckit.ts
export interface SpecKitFlowNode extends FlowgramNode {
  data: {
    label: string
    content: string
    preview: string
    priority?: 'P1' | 'P2' | 'P3'
    storyNumber?: number
    requirementId?: string
    status?: 'draft' | 'completed' | 'ai-generating'
    wordCount?: number
    lastModified?: number
    astNodeRef?: any
  }
}
```

**验收标准**:
- [ ] TypeScript 编译无错误
- [ ] 类型定义完整
- [ ] 继承自 flowgram.ai 的节点类型

---

### Task 2.2: 实现 Markdown 解析（Markdown → AST）
**类型**: Implementation  
**文件**: `src/adapters/MarkdownParser.ts`

**核心接口**:
```typescript
export class MarkdownParser {
  private processor: unified.Processor
  
  constructor() {
    this.processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
  }
  
  parse(markdown: string): Root {
    return this.processor.parse(markdown) as Root
  }
}
```

**验收标准**:
- [ ] 能够解析基础 Markdown（标题、段落、列表）
- [ ] 能够解析 spec.md 文件
- [ ] 单元测试通过

---

### Task 2.3: 实现 AST → flowgram 节点转换
**类型**: Implementation  
**文件**: `src/adapters/MarkdownAdapter.ts`

**核心逻辑**:
```typescript
export class MarkdownAdapter {
  parseMarkdownToNodes(markdown: string): SpecKitFlowNode[] {
    const ast = markdownParser.parse(markdown)
    const nodes: SpecKitFlowNode[] = []
    const nodeStack: SpecKitFlowNode[] = []
    
    visit(ast, (node) => {
      if (node.type === 'heading') {
        const flowNode = this.createNodeFromHeading(node as Heading)
        
        // 建立层级关系
        while (nodeStack.length >= node.depth) {
          nodeStack.pop()
        }
        
        if (nodeStack.length > 0) {
          const parent = nodeStack[nodeStack.length - 1]
          parent.children = parent.children || []
          parent.children.push(flowNode.id)
        }
        
        nodeStack.push(flowNode)
        nodes.push(flowNode)
      }
    })
    
    return nodes
  }
}
```

**验收标准**:
- [ ] spec.md 转换为节点数组
- [ ] 节点层级关系正确（# → ## → ###）
- [ ] 父子关系正确（children 数组）
- [ ] 单元测试覆盖率 > 80%

---

### Task 2.4: 实现 flowgram 节点 → Markdown 转换
**类型**: Implementation  
**文件**: `src/adapters/MarkdownAdapter.ts`

**核心逻辑**:
```typescript
buildNodesToMarkdown(nodes: SpecKitFlowNode[]): string {
  const ast: Root = { type: 'root', children: [] }
  
  const traverse = (node: SpecKitFlowNode, depth: number) => {
    ast.children.push({
      type: 'heading',
      depth: depth,
      children: [{ type: 'text', value: node.data.label }]
    })
    
    // 递归处理子节点
    if (node.children) {
      node.children.forEach(childId => {
        const child = nodes.find(n => n.id === childId)
        if (child) traverse(child, depth + 1)
      })
    }
  }
  
  // 找到根节点
  const roots = nodes.filter(n => !nodes.some(p => p.children?.includes(n.id)))
  roots.forEach(root => traverse(root, 1))
  
  return stringify(ast)
}
```

**验收标准**:
- [ ] 节点数组转换为 Markdown 文本
- [ ] 标题层级正确
- [ ] 反向转换测试通过

---

### Task 2.5: 实现 SpecKit 识别器
**类型**: Implementation  
**文件**: `src/speckit/SpecKitRecognizer.ts`, `src/speckit/patterns.ts`

**模式定义**:
```typescript
export const SPEC_KIT_PATTERNS = [
  {
    type: 'user-story',
    match: /^用户故事 (\d+) - (.+)（优先级：(P\d+)）$/,
    extract: (text) => ({
      storyNumber: parseInt(match![1]),
      title: match![2],
      priority: match![3]
    })
  },
  {
    type: 'acceptance-scenario',
    match: /^验收场景$/,
    extract: () => ({ isAcceptanceSection: true })
  },
  {
    type: 'functional-requirement',
    match: /^- \*\*FR-(\d+)\*\*/,
    extract: (text) => ({
      requirementId: `FR-${match![1]}`
    })
  },
  {
    type: 'success-criteria',
    match: /^- \*\*SC-(\d+)\*\*/,
    extract: (text) => ({
      criteriaId: `SC-${match![1]}`
    })
  },
  {
    type: 'boundary-case',
    match: /^边界情况$/,
    extract: () => ({ isBoundarySection: true })
  },
  {
    type: 'task',
    match: /^- \[ \] (.+)$/,
    extract: (text) => ({
      taskDescription: match![1],
      completed: false
    })
  },
  {
    type: 'priority-marker',
    match: /（优先级：(P\d+)）/,
    extract: (text) => ({
      priority: match![1]
    })
  }
]
```

**验收标准**:
- [ ] 识别用户故事模式
- [ ] 识别验收场景标题
- [ ] 识别功能性需求（FR-XXX）
- [ ] 识别成功标准（SC-XXX）
- [ ] 识别边界情况标题
- [ ] 识别任务列表项（- [ ]）
- [ ] 识别优先级标记（P1/P2/P3）
- [ ] 单元测试覆盖所有模式（7种）

---

### Task 2.6: 编写往返测试
**类型**: Test  
**文件**: `src/adapters/__tests__/roundtrip.test.ts`

**测试用例**:
```typescript
test('Markdown → Nodes → Markdown 往返测试', () => {
  const originalMarkdown = `
# 功能规格

## 用户场景

### 用户故事 1 - 标题（优先级：P1）
  `
  
  const nodes = adapter.parseMarkdownToNodes(originalMarkdown)
  const rebuiltMarkdown = adapter.buildNodesToMarkdown(nodes)
  
  expect(normalizeMarkdown(rebuiltMarkdown)).toBe(normalizeMarkdown(originalMarkdown))
})
```

**验收标准**:
- [ ] spec.md 往返测试通过
- [ ] 各种 Markdown 语法往返测试通过
- [ ] 测试覆盖率 > 90%

---

### Task 2.7: 集成到 flowgram.ai 应用
**类型**: Implementation  
**文件**: `src/App.tsx`（扩展 flowgram.ai 原有文件）

**修改内容**:
```typescript
// 添加"打开 Markdown 文件"功能
import { MarkdownAdapter } from './adapters/MarkdownAdapter'
import { SpecKitRecognizer } from './speckit/SpecKitRecognizer'

const App = () => {
  const [nodes, setNodes] = useState<SpecKitFlowNode[]>([])
  
  const handleOpenMarkdown = async () => {
    // 选择文件（临时使用 <input type="file">，Phase 5 后改为 Tauri）
    const file = await selectFile()
    const markdown = await file.text()
    
    // 转换为节点
    const adapter = new MarkdownAdapter()
    const recognizer = new SpecKitRecognizer()
    
    let parsedNodes = adapter.parseMarkdownToNodes(markdown)
    parsedNodes = recognizer.recognizeAll(parsedNodes)
    
    setNodes(parsedNodes)
  }
  
  return (
    <div>
      <button onClick={handleOpenMarkdown}>打开 Markdown 文件</button>
      {/* flowgram.ai 原有的 Canvas 组件 */}
      <Canvas nodes={nodes} />
    </div>
  )
}
```

**验收标准**:
- [ ] 能够打开 spec.md 文件
- [ ] 节点正确显示在 flowgram.ai 画布上
- [ ] 节点层级关系正确
- [ ] spec-kit 元数据正确识别（优先级等）

---

### Checkpoint - Phase 2
- [ ] Markdown 文件能转换为 flowgram.ai 节点
- [ ] flowgram.ai 节点能转换回 Markdown 文件
- [ ] spec-kit 特定模式正确识别
- [ ] 往返测试通过（无信息丢失）
- [ ] 集成到 flowgram.ai 应用，能显示 spec.md

---

## Phase 3: 卡片节点扩展（2 天）

### Task 3.1: 扩展 flowgram.ai 卡片节点组件
**类型**: Implementation  
**文件**: `src/components/Node.tsx`（扩展 flowgram.ai 原有组件）

**修改策略**: 最小化侵入，仅添加 spec-kit 特化展示

**扩展内容**:
```typescript
const Node: React.FC<NodeProps> = ({ node }) => {
  // flowgram.ai 原有逻辑
  // ...
  
  // 我们的扩展：检测 spec-kit 节点
  const isSpecKitNode = node.type === 'user-story' || node.type === 'heading'
  const priority = node.data.priority
  const wordCount = node.data.wordCount
  
  return (
    <div className="node-card">
      {/* flowgram.ai 原有的卡片渲染 */}
      <div className="card-header">
        <span className="icon">{getNodeIcon(node.type)}</span>
        <span className="title">{node.data.label}</span>
        
        {/* 我们的扩展：优先级徽章 */}
        {priority && (
          <span className={`priority-badge ${priority.toLowerCase()}`}>
            {priority}
          </span>
        )}
      </div>
      
      {/* flowgram.ai 原有的内容区域 */}
      <div className="card-content">
        <p className="preview">{node.data.preview}</p>
      </div>
      
      {/* 我们的扩展：元数据底栏 */}
      {isSpecKitNode && (
        <div className="card-footer">
          <span>{node.data.status || 'draft'}</span>
          <span>{wordCount} 字</span>
          <span>{formatTime(node.data.lastModified)}</span>
        </div>
      )}
    </div>
  )
}
```

**验收标准**:
- [ ] 卡片显示优先级徽章（P1/P2/P3）
- [ ] 卡片显示图标（根据类型）
- [ ] 卡片显示内容预览
- [ ] 卡片显示元数据（状态、字数、时间）
- [ ] 样式与 flowgram.ai 一致

---

### Task 3.2: 实现优先级徽章样式
**类型**: Implementation  
**文件**: `src/components/Node.module.css`

**CSS 样式**:
```css
.priority-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.priority-badge.p1 {
  background: #ff4d4f;
  color: white;
}

.priority-badge.p2 {
  background: #fa8c16;
  color: white;
}

.priority-badge.p3 {
  background: #1890ff;
  color: white;
}
```

**验收标准**:
- [ ] P1 徽章红色醒目
- [ ] P2 徽章橙色
- [ ] P3 徽章蓝色
- [ ] 徽章位置合理（标题栏右上角）

---

### Task 3.3: 实现标题 inline 编辑
**类型**: Implementation  
**文件**: `src/components/Node.tsx`

**交互逻辑**:
```typescript
const [isEditingTitle, setIsEditingTitle] = useState(false)
const [titleValue, setTitleValue] = useState(node.data.label)

const handleTitleClick = (e: React.MouseEvent) => {
  e.stopPropagation() // 阻止触发配置面板
  setIsEditingTitle(true)
}

const handleTitleSave = () => {
  // 调用 Markdown Adapter 更新标题
  updateNodeLabel(node.id, titleValue)
  
  // 如果右侧编辑器已打开，同步更新编辑器内容
  if (isPropertiesPanelOpen) {
    syncEditorContent(node.id, titleValue)
  }
  
  setIsEditingTitle(false)
}

return (
  <div className="card-title">
    {isEditingTitle ? (
      <input
        value={titleValue}
        onChange={(e) => setTitleValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleTitleSave()
          if (e.key === 'Escape') setIsEditingTitle(false)
        }}
        onBlur={handleTitleSave}
        autoFocus
      />
    ) : (
      <span
        onClick={handleTitleClick}
        onMouseEnter={() => setShowEditIcon(true)}
        onMouseLeave={() => setShowEditIcon(false)}
      >
        {node.data.label}
        {showEditIcon && <span className="edit-icon">✏️</span>}
      </span>
    )}
  </div>
)
```

**验收标准**:
- [ ] 悬停标题显示 ✏️ 图标
- [ ] 单击进入编辑模式（使用 contentEditable 或 input）
- [ ] Enter 保存，Esc 取消
- [ ] 保存后节点标题更新
- [ ] 与右侧面板编辑器同步（标题修改后自动更新编辑器内容）

---

### Task 3.4: 实现节点折叠/展开功能 ⭐
**类型**: Implementation  
**文件**: `src/components/Node.tsx`, `src/stores/layoutStore.ts`

**功能实现**:
```typescript
// 节点数据扩展
interface SpecKitFlowNode {
  // ... 其他属性
  collapsed?: boolean  // 折叠状态
}

// 组件逻辑
const Node: React.FC<NodeProps> = ({ node, children }) => {
  const hasChildren = children && children.length > 0
  const [collapsed, setCollapsed] = useState(node.collapsed || false)
  
  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newState = !collapsed
    
    // 更新节点状态
    updateNodeCollapsed(node.id, newState)
    setCollapsed(newState)
    
    // 保存到布局配置（复用 flowgram.ai 的布局保存逻辑）
    saveLayoutState(node.id, { collapsed: newState })
  }
  
  return (
    <div className="node-card">
      <div className="card-header">
        {/* 折叠/展开按钮（仅在有子节点时显示） */}
        {hasChildren && (
          <button
            className="collapse-toggle"
            onClick={handleToggleCollapse}
            title={collapsed ? '展开' : '折叠'}
          >
            {collapsed ? '▶' : '▼'}
          </button>
        )}
        
        {/* 其他卡片内容 */}
        {/* ... */}
      </div>
      
      {/* 子节点容器（根据 collapsed 控制可见性） */}
      {!collapsed && children}
    </div>
  )
}
```

**样式**:
```css
.collapse-toggle {
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 8px;
  font-size: 12px;
  transition: transform 0.2s;
}

.collapse-toggle:hover {
  transform: scale(1.2);
}
```

**键盘快捷键**:
```typescript
// 监听 Space 键切换折叠/展开
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' && isFocused) {
      e.preventDefault()
      handleToggleCollapse()
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [isFocused, collapsed])
```

**验收标准**:
- [ ] 有子节点的卡片显示折叠/展开按钮（▶/▼）
- [ ] 点击按钮切换子节点可见性
- [ ] 折叠时子节点隐藏，连线起点保留
- [ ] 折叠状态持久化保存（复用 flowgram.ai 布局保存）
- [ ] 支持键盘快捷键（Space 切换）
- [ ] 折叠/展开动画流畅

---

### Checkpoint - Phase 3
- [ ] 卡片展示丰富信息（图标、优先级、预览、元数据）
- [ ] 优先级徽章样式正确
- [ ] 标题 inline 编辑流畅（与右侧编辑器同步）
- [ ] 节点折叠/展开功能正常（折叠状态持久化）
- [ ] 与 flowgram.ai 风格一致

---

## Phase 3.5: 节点增删管理（2 天）⭐ P2 功能

**注意**: 此阶段为 P2 功能，可根据 MVP 开发进度选择在 V1.0 实现或延后到后续版本。

### 前置条件
- [ ] Phase 2 完成（Markdown Adapter 可用）
- [ ] Phase 3 完成（卡片节点可用）

---

### Task 3.5.1: 扩展 Markdown Adapter 支持节点 CRUD
**类型**: Implementation  
**文件**: `src/adapters/MarkdownAdapter.ts`

**新增方法**:
```typescript
export class MarkdownAdapter {
  // ... 现有方法 ...
  
  /**
   * 在 AST 中插入新标题节点
   */
  insertNode(
    parentId: string,
    type: 'heading' | 'user-story' | 'section',
    title: string,
    priority?: 'P1' | 'P2' | 'P3'
  ): SpecKitFlowNode {
    const nodes = this.currentNodes
    const parent = nodes.find(n => n.id === parentId)
    
    if (!parent) {
      throw new Error(`Parent node ${parentId} not found`)
    }
    
    // 计算新节点的深度（父节点深度 + 1）
    const depth = this.getNodeDepth(parent) + 1
    
    // 创建新节点
    const newNode: SpecKitFlowNode = {
      id: generateId(title),
      type: type,
      position: { x: 0, y: 0 },
      data: {
        label: title,
        content: title,
        preview: title.slice(0, 50),
        priority: priority,
        status: 'draft',
        lastModified: Date.now()
      },
      children: []
    }
    
    // 在 AST 中插入新的 heading 节点
    const headingNode: Heading = {
      type: 'heading',
      depth: depth,
      children: [{ type: 'text', value: title }]
    }
    
    // 更新父节点的 children 数组
    parent.children = parent.children || []
    parent.children.push(newNode.id)
    
    // 添加到节点列表
    nodes.push(newNode)
    
    return newNode
  }
  
  /**
   * 从 AST 中删除节点及其子节点
   */
  deleteNode(nodeId: string): { deletedNodes: SpecKitFlowNode[], cascadeCount: number } {
    const nodes = this.currentNodes
    const node = nodes.find(n => n.id === nodeId)
    
    if (!node) {
      throw new Error(`Node ${nodeId} not found`)
    }
    
    // 检查是否为根节点
    const isRoot = !nodes.some(n => n.children?.includes(nodeId))
    if (isRoot && nodes.length > 1) {
      throw new Error('Cannot delete root node when other nodes exist')
    }
    
    // 收集要删除的节点（包括子节点）
    const nodesToDelete: SpecKitFlowNode[] = []
    const collectNodes = (id: string) => {
      const n = nodes.find(node => node.id === id)
      if (n) {
        nodesToDelete.push(n)
        n.children?.forEach(childId => collectNodes(childId))
      }
    }
    collectNodes(nodeId)
    
    // 从父节点的 children 中移除
    const parent = nodes.find(n => n.children?.includes(nodeId))
    if (parent) {
      parent.children = parent.children!.filter(id => id !== nodeId)
    }
    
    // 从节点列表中移除
    nodesToDelete.forEach(n => {
      const index = nodes.indexOf(n)
      if (index > -1) {
        nodes.splice(index, 1)
      }
    })
    
    return {
      deletedNodes: nodesToDelete,
      cascadeCount: nodesToDelete.length - 1
    }
  }
  
  /**
   * 移动节点到新的父节点下
   */
  moveNode(nodeId: string, newParentId: string, newIndex?: number): void {
    const nodes = this.currentNodes
    const node = nodes.find(n => n.id === nodeId)
    const newParent = nodes.find(n => n.id === newParentId)
    
    if (!node || !newParent) {
      throw new Error('Node or parent not found')
    }
    
    // 检测循环引用
    if (this.wouldCreateCycle(nodeId, newParentId)) {
      throw new Error('Cannot move node to its descendant')
    }
    
    // 从原父节点移除
    const oldParent = nodes.find(n => n.children?.includes(nodeId))
    if (oldParent) {
      oldParent.children = oldParent.children!.filter(id => id !== nodeId)
    }
    
    // 添加到新父节点
    newParent.children = newParent.children || []
    if (newIndex !== undefined) {
      newParent.children.splice(newIndex, 0, nodeId)
    } else {
      newParent.children.push(nodeId)
    }
  }
  
  /**
   * 验证操作合法性
   */
  validateNodeOperation(operation: 'insert' | 'delete' | 'move', params: any): ValidationResult {
    // 实现验证逻辑
    // ...
  }
  
  // 辅助方法
  private getNodeDepth(node: SpecKitFlowNode): number {
    // 计算节点深度
    // ...
  }
  
  private wouldCreateCycle(nodeId: string, potentialParentId: string): boolean {
    // 检测循环引用
    // ...
  }
}
```

**验收标准**:
- [ ] `insertNode` 方法正常工作（创建新节点）
- [ ] `deleteNode` 方法正常工作（删除节点及子节点）
- [ ] `moveNode` 方法正常工作（移动节点）
- [ ] `validateNodeOperation` 验证操作合法性
- [ ] 不允许删除根节点（当有其他节点时）
- [ ] 检测循环引用（父节点不能移动到子节点下）
- [ ] 单元测试覆盖率 > 85%

---

### Task 3.5.2: 实现右键上下文菜单
**类型**: Implementation  
**文件**: `src/components/ContextMenu.tsx`

**组件实现**:
```typescript
interface ContextMenuProps {
  node?: SpecKitFlowNode  // undefined 表示画布右键
  position: { x: number; y: number }
  onClose: () => void
  onAddChild: (parentId: string) => void
  onDelete: (nodeId: string) => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  node,
  position,
  onClose,
  onAddChild,
  onDelete
}) => {
  return (
    <div
      className="context-menu"
      style={{ left: position.x, top: position.y }}
    >
      {node ? (
        // 右键节点
        <>
          <MenuItem onClick={() => { onAddChild(node.id); onClose() }}>
            ➕ 新增子节点
          </MenuItem>
          <MenuItem onClick={() => { onDelete(node.id); onClose() }}>
            🗑️ 删除节点
          </MenuItem>
          <Divider />
          <MenuItem>📋 复制</MenuItem>
          <MenuItem>📌 固定</MenuItem>
        </>
      ) : (
        // 右键画布
        <>
          <MenuItem onClick={() => { onAddChild('root'); onClose() }}>
            ➕ 新增根节点
          </MenuItem>
          <MenuItem>📂 导入文件</MenuItem>
        </>
      )}
    </div>
  )
}
```

**交互逻辑**:
```typescript
// 在 Canvas 组件中
const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

const handleContextMenu = (e: React.MouseEvent, node?: SpecKitFlowNode) => {
  e.preventDefault()
  setContextMenu({
    node: node,
    position: { x: e.clientX, y: e.clientY }
  })
}

const handleCloseContextMenu = () => {
  setContextMenu(null)
}
```

**验收标准**:
- [ ] 右键节点显示上下文菜单
- [ ] 右键画布显示上下文菜单
- [ ] 菜单样式与 flowgram.ai 一致
- [ ] 点击菜单项执行对应操作
- [ ] 点击菜单外关闭菜单

---

### Task 3.5.3: 实现新增节点对话框
**类型**: Implementation  
**文件**: `src/components/AddNodeDialog.tsx`

**对话框实现**:
```typescript
interface AddNodeDialogProps {
  parentNode: SpecKitFlowNode
  onConfirm: (data: { type: string; title: string; priority?: string }) => void
  onCancel: () => void
}

export const AddNodeDialog: React.FC<AddNodeDialogProps> = ({
  parentNode,
  onConfirm,
  onCancel
}) => {
  const [nodeType, setNodeType] = useState('heading')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<string>()
  
  const handleConfirm = () => {
    // 验证
    if (!title.trim()) {
      showError('标题不能为空')
      return
    }
    
    // 检查是否与同级节点重复
    const siblings = getAllSiblings(parentNode)
    if (siblings.some(n => n.data.label === title)) {
      showError('标题与同级节点重复')
      return
    }
    
    onConfirm({ type: nodeType, title, priority })
  }
  
  return (
    <Dialog>
      <DialogTitle>新增节点</DialogTitle>
      <DialogContent>
        <FormField label="节点类型">
          <Select value={nodeType} onChange={setNodeType}>
            <option value="heading">章节</option>
            <option value="user-story">用户故事</option>
            <option value="acceptance-scenario">验收场景</option>
          </Select>
        </FormField>
        
        <FormField label="标题">
          <Input
            value={title}
            onChange={setTitle}
            placeholder="输入节点标题"
            autoFocus
          />
        </FormField>
        
        {nodeType === 'user-story' && (
          <FormField label="优先级">
            <Select value={priority} onChange={setPriority}>
              <option value="">无</option>
              <option value="P1">P1（高）</option>
              <option value="P2">P2（中）</option>
              <option value="P3">P3（低）</option>
            </Select>
          </FormField>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={handleConfirm} primary>确定</Button>
      </DialogActions>
    </Dialog>
  )
}
```

**验收标准**:
- [ ] 对话框显示正确（节点类型、标题、优先级字段）
- [ ] 验证标题不为空
- [ ] 验证标题不与同级节点重复
- [ ] 确认后调用 `insertNode` 方法
- [ ] 创建成功后刷新流程图

---

### Task 3.5.4: 实现删除节点功能
**类型**: Implementation  
**文件**: `src/components/DeleteNodeDialog.tsx`

**确认对话框**:
```typescript
interface DeleteNodeDialogProps {
  node: SpecKitFlowNode
  childrenCount: number
  onConfirm: (cascadeDelete: boolean) => void
  onCancel: () => void
}

export const DeleteNodeDialog: React.FC<DeleteNodeDialogProps> = ({
  node,
  childrenCount,
  onConfirm,
  onCancel
}) => {
  const [cascadeDelete, setCascadeDelete] = useState(true)
  
  return (
    <Dialog>
      <DialogTitle>⚠️ 确认删除</DialogTitle>
      <DialogContent>
        <p>确定要删除节点 <strong>"{node.data.label}"</strong> 吗？</p>
        
        {childrenCount > 0 && (
          <>
            <Warning>
              该节点有 <strong>{childrenCount}</strong> 个子节点
            </Warning>
            
            <RadioGroup value={cascadeDelete} onChange={setCascadeDelete}>
              <Radio value={true}>级联删除（删除所有子节点）</Radio>
              <Radio value={false}>仅删除当前节点（子节点提升）</Radio>
            </RadioGroup>
          </>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={() => onConfirm(cascadeDelete)} danger>确定删除</Button>
      </DialogActions>
    </Dialog>
  )
}
```

**执行删除**:
```typescript
const handleDeleteNode = async (nodeId: string, cascadeDelete: boolean) => {
  try {
    // 调用 Markdown Adapter 删除节点
    const { deletedNodes } = adapter.deleteNode(nodeId)
    
    // 重新生成 Markdown
    const markdown = adapter.buildNodesToMarkdown(allNodes)
    
    // 保存文件
    await fileSystemService.writeFile(currentFilePath, markdown)
    
    // 刷新流程图
    setNodes([...allNodes])
    
    showSuccess(`已删除 ${deletedNodes.length} 个节点`)
  } catch (error) {
    showError(error.message)
  }
}
```

**验收标准**:
- [ ] 显示删除确认对话框
- [ ] 有子节点时显示警告和选项（级联删除 / 仅删除当前）
- [ ] 确认后调用 `deleteNode` 方法
- [ ] Markdown 文件中的对应部分被移除
- [ ] 流程图自动刷新
- [ ] 不允许删除根节点（显示错误提示）

---

### Task 3.5.5: 实现节点拖拽重排序
**类型**: Implementation  
**文件**: `src/hooks/useDragReorder.ts`

**拖拽逻辑**:
```typescript
export function useDragReorder(
  nodes: SpecKitFlowNode[],
  onReorder: (nodeId: string, newParentId: string, newIndex: number) => void
) {
  const [draggedNode, setDraggedNode] = useState<SpecKitFlowNode | null>(null)
  const [dropTarget, setDropTarget] = useState<{ parentId: string; index: number } | null>(null)
  
  const handleDragStart = (node: SpecKitFlowNode) => {
    setDraggedNode(node)
  }
  
  const handleDragOver = (targetNode: SpecKitFlowNode, position: 'before' | 'after' | 'child') => {
    if (!draggedNode) return
    
    // 验证：不允许父节点拖到子节点下
    if (wouldCreateCycle(draggedNode.id, targetNode.id)) {
      setDropTarget(null)
      return
    }
    
    // 计算目标位置
    const dropTarget = calculateDropTarget(targetNode, position)
    setDropTarget(dropTarget)
  }
  
  const handleDrop = () => {
    if (!draggedNode || !dropTarget) return
    
    // 执行重排序
    onReorder(draggedNode.id, dropTarget.parentId, dropTarget.index)
    
    // 清理状态
    setDraggedNode(null)
    setDropTarget(null)
  }
  
  return {
    draggedNode,
    dropTarget,
    handleDragStart,
    handleDragOver,
    handleDrop
  }
}
```

**视觉反馈**:
```typescript
// 在 Node 组件中
const Node: React.FC<NodeProps> = ({ node }) => {
  const { draggedNode, dropTarget, handleDragStart, handleDragOver, handleDrop } = useDragReorder()
  
  const isDropTarget = dropTarget?.parentId === node.id
  
  return (
    <div
      className={`node-card ${isDropTarget ? 'drop-target' : ''}`}
      draggable
      onDragStart={() => handleDragStart(node)}
      onDragOver={(e) => {
        e.preventDefault()
        handleDragOver(node, 'child')
      }}
      onDrop={handleDrop}
    >
      {/* 目标位置指示线 */}
      {isDropTarget && <div className="drop-indicator" />}
      
      {/* ... 其他内容 */}
    </div>
  )
}
```

**验收标准**:
- [ ] 支持同级拖拽调整顺序
- [ ] 支持跨层级拖拽（移动到其他父节点下）
- [ ] 拖拽时显示目标位置指示线
- [ ] 不允许父节点拖到子节点下（显示禁止图标）
- [ ] 拖拽完成后 Markdown 文件顺序更新
- [ ] 流程图自动刷新

---

### Task 3.5.6: 集成节点管理功能到应用
**类型**: Implementation  
**文件**: `src/App.tsx`, `src/stores/nodeStore.ts`

**状态管理**:
```typescript
// 节点操作状态
const [showAddNodeDialog, setShowAddNodeDialog] = useState(false)
const [showDeleteDialog, setShowDeleteDialog] = useState(false)
const [targetNode, setTargetNode] = useState<SpecKitFlowNode | null>(null)

// 新增节点
const handleAddNode = async (parentId: string, data: NodeData) => {
  const newNode = adapter.insertNode(parentId, data.type, data.title, data.priority)
  
  // 重新生成 Markdown
  const markdown = adapter.buildNodesToMarkdown(allNodes)
  await fileSystemService.writeFile(currentFilePath, markdown)
  
  // 刷新流程图
  setNodes([...allNodes])
  
  // 自动布局新节点
  applyLayout()
}

// 删除节点
const handleDeleteNode = async (nodeId: string) => {
  const { deletedNodes } = adapter.deleteNode(nodeId)
  
  // 重新生成 Markdown
  const markdown = adapter.buildNodesToMarkdown(allNodes)
  await fileSystemService.writeFile(currentFilePath, markdown)
  
  // 刷新流程图
  setNodes([...allNodes])
}

// 移动节点
const handleMoveNode = async (nodeId: string, newParentId: string, newIndex: number) => {
  adapter.moveNode(nodeId, newParentId, newIndex)
  
  // 重新生成 Markdown
  const markdown = adapter.buildNodesToMarkdown(allNodes)
  await fileSystemService.writeFile(currentFilePath, markdown)
  
  // 刷新流程图
  setNodes([...allNodes])
}
```

**验收标准**:
- [ ] 右键菜单集成到画布
- [ ] 新增节点功能完整可用
- [ ] 删除节点功能完整可用
- [ ] 拖拽重排序功能完整可用
- [ ] 所有操作后 Markdown 往返测试通过
- [ ] 所有操作后流程图自动刷新

---

### Checkpoint - Phase 3.5
- [ ] Markdown Adapter 支持节点 CRUD
- [ ] 右键上下文菜单正常工作
- [ ] 新增节点对话框和验证正常
- [ ] 删除节点（含级联删除）正常
- [ ] 拖拽重排序正常（同级和跨层级）
- [ ] 所有操作的合法性验证正常
- [ ] Markdown 往返测试通过

---

## Phase 4: TipTap 富文本编辑器集成（3 天）

### Task 4.1: 实现 TipTap 编辑器组件
**类型**: Implementation  
**文件**: `src/components/RichTextEditor/RichTextEditor.tsx`

**组件实现**:
```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

interface RichTextEditorProps {
  value: string
  onChange: (markdown: string) => void
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown()
      onChange(markdown)
    }
  })
  
  return <EditorContent editor={editor} />
}
```

**验收标准**:
- [ ] 编辑器正常初始化
- [ ] Markdown 内容自动转换为富文本显示
- [ ] 编辑后自动转换回 Markdown

---

### Task 4.2: 实现编辑器工具栏
**类型**: Implementation  
**文件**: `src/components/RichTextEditor/EditorToolbar.tsx`

**工具栏按钮**:
```typescript
const EditorToolbar: React.FC = ({ editor }) => {
  return (
    <div className="editor-toolbar">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </button>
      
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </button>
      
      <select onChange={(e) => {
        const level = parseInt(e.target.value)
        editor.chain().focus().toggleHeading({ level }).run()
      }}>
        <option value="0">正文</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
      </select>
      
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • 列表
      </button>
      
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1. 序号
      </button>
      
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        &lt;&gt; 代码
      </button>
      
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        "" 引用
      </button>
    </div>
  )
}
```

**验收标准**:
- [ ] 所有工具栏按钮正常工作
- [ ] 按钮激活状态正确（选中文本是加粗时，B 按钮高亮）
- [ ] 工具栏样式美观

---

### Task 4.3: 扩展 flowgram.ai PropertiesPanel
**类型**: Implementation  
**文件**: `src/components/PropertiesPanel.tsx`（扩展 flowgram.ai 原有组件）

**集成 TipTap**:
```typescript
const PropertiesPanel: React.FC<Props> = ({ node, onUpdate }) => {
  // flowgram.ai 原有逻辑
  // ...
  
  // 我们的扩展：spec-kit 节点使用 TipTap
  const isSpecKitNode = node.type === 'heading' || node.type === 'user-story'
  
  const handleContentChange = (markdown: string) => {
    onUpdate(node.id, { ...node.data, content: markdown })
  }
  
  return (
    <div className="properties-panel">
      <h3>节点配置</h3>
      
      {/* flowgram.ai 原有的基础属性 */}
      <NodeBasicProperties node={node} />
      
      {/* 内容编辑区域 */}
      <div className="content-editor">
        {isSpecKitNode ? (
          // 我们的 TipTap 编辑器
          <>
            <EditorToolbar editor={editor} />
            <RichTextEditor
              value={node.data.content || ''}
              onChange={handleContentChange}
            />
          </>
        ) : (
          // flowgram.ai 原有编辑器
          <DefaultEditor node={node} />
        )}
      </div>
    </div>
  )
}
```

**验收标准**:
- [ ] 点击 spec-kit 节点 → 配置面板显示 TipTap
- [ ] 点击其他节点 → 配置面板显示原有编辑器
- [ ] 面板样式与 flowgram.ai 一致
- [ ] 无样式冲突

---

### Task 4.4: 实现自动保存
**类型**: Implementation  
**文件**: `src/hooks/useAutoSave.ts`

**防抖保存**:
```typescript
import { useDebouncedCallback } from 'use-debounce'

export function useAutoSave(
  nodeId: string,
  content: string,
  onSave: (id: string, content: string) => void
) {
  const debouncedSave = useDebouncedCallback(
    (id, content) => {
      onSave(id, content)
      showToast('已自动保存')
    },
    1000 // 1 秒防抖
  )
  
  useEffect(() => {
    if (content) {
      debouncedSave(nodeId, content)
    }
  }, [content, nodeId])
}
```

**验收标准**:
- [ ] 编辑停止 1 秒后自动保存
- [ ] 显示"已保存"提示
- [ ] 保存后节点数据更新

---

### Task 4.5: 编写 TipTap 往返测试
**类型**: Test  
**文件**: `src/components/RichTextEditor/__tests__/tiptap.test.ts`

**测试用例**:
```typescript
test('Markdown → TipTap → Markdown', () => {
  const markdown = '## 标题\n\n**加粗** 和 *斜体*'
  
  editor.commands.setContent(markdown)
  const output = editor.storage.markdown.getMarkdown()
  
  expect(normalizeMarkdown(output)).toBe(normalizeMarkdown(markdown))
})
```

**验收标准**:
- [ ] 各种 Markdown 语法转换测试通过
- [ ] 格式化操作测试通过
- [ ] 测试覆盖率 > 80%

---

### Checkpoint - Phase 4
- [ ] TipTap 编辑器集成到配置面板
- [ ] 工具栏所有按钮正常工作
- [ ] 富文本 ↔ Markdown 双向转换无损
- [ ] 自动保存功能正常
- [ ] 所有测试通过

---

## Phase 5: Tauri 桌面化（2 天）

### Task 5.1: 初始化 Tauri 配置
**类型**: Configuration  
**文件**: `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`

**步骤**:
```bash
npm install -D @tauri-apps/cli@^1.5.0
npm install @tauri-apps/api@^1.5.0
npm run tauri init
```

**配置 tauri.conf.json**:
```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "tauri": {
    "allowlist": {
      "fs": {
        "all": true,
        "scope": ["$HOME/**/*.md"]
      },
      "dialog": {
        "open": true
      }
    }
  }
}
```

**验收标准**:
- [ ] Tauri 配置文件已创建
- [ ] `npm run tauri dev` 启动 Tauri 窗口
- [ ] Tauri 窗口正常显示 flowgram.ai 应用

---

### Task 5.2: 实现 Tauri 文件系统命令
**类型**: Implementation  
**文件**: `src-tauri/src/fs_commands.rs`

**Rust 命令**:
```rust
use std::fs;
use tauri::command;

#[command]
pub fn read_markdown_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file: {}", e))
}

#[command]
pub fn write_markdown_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file: {}", e))
}

#[command]
pub fn select_markdown_file() -> Option<String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    
    FileDialogBuilder::new()
        .add_filter("Markdown", &["md"])
        .pick_file()
        .and_then(|path| path.to_str().map(|s| s.to_string()))
}
```

**验收标准**:
- [ ] Rust 代码编译通过
- [ ] 命令在 main.rs 中注册
- [ ] 前端能调用命令（使用 @tauri-apps/api）

---

### Task 5.3: 实现文件监听服务
**类型**: Implementation  
**文件**: `src-tauri/src/watcher.rs`, `src-tauri/Cargo.toml`

**添加依赖**:
```toml
[dependencies]
notify = "6.1"
```

**实现监听**:
```rust
use notify::{Watcher, RecursiveMode, Event};
use tauri::{AppHandle, Manager};
use std::sync::mpsc::channel;

pub fn start_file_watcher(
    app_handle: AppHandle,
    file_path: String
) -> notify::Result<()> {
    let (tx, rx) = channel();
    
    let mut watcher = notify::recommended_watcher(move |res: notify::Result<Event>| {
        if let Ok(event) = res {
            tx.send(event).unwrap();
        }
    })?;
    
    watcher.watch(
        std::path::Path::new(&file_path),
        RecursiveMode::NonRecursive
    )?;
    
    std::thread::spawn(move || {
        for event in rx {
            app_handle.emit_all("file-changed", event).unwrap();
        }
    });
    
    Ok(())
}
```

**验收标准**:
- [ ] 文件修改触发 `file-changed` 事件
- [ ] 前端接收到事件
- [ ] 能够重新加载文件

---

### Task 5.4: 前端集成 Tauri API
**类型**: Implementation  
**文件**: `src/App.tsx`, `src/services/fileSystem.ts`

**文件系统服务**:
```typescript
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

export const fileSystemService = {
  async readFile(path: string): Promise<string> {
    return invoke('read_markdown_file', { path })
  },
  
  async writeFile(path: string, content: string): Promise<void> {
    return invoke('write_markdown_file', { path, content })
  },
  
  async selectFile(): Promise<string | null> {
    return invoke('select_markdown_file')
  },
  
  async watchFile(path: string, callback: () => void) {
    await invoke('start_file_watcher', { filePath: path })
    await listen('file-changed', callback)
  }
}
```

**验收标准**:
- [ ] 能够选择 Markdown 文件
- [ ] 能够读取文件内容
- [ ] 能够保存文件
- [ ] 文件监听正常工作

---

### Task 5.5: 实现编辑循环避免 ⭐
**类型**: Implementation  
**文件**: `src/services/fileSystemService.ts`, `src/App.tsx`

**逻辑**:
```typescript
// 全局标志位
let isInternalSave = false

const handleSaveNode = async (nodeId: string, content: string) => {
  // 标记为内部保存
  isInternalSave = true
  
  // 更新节点数据
  updateNode(nodeId, { content })
  
  // 保存到文件
  const markdown = adapter.buildNodesToMarkdown(allNodes)
  await fileSystemService.writeFile(currentFilePath, markdown)
  
  // 1 秒后重置标志（给文件监听足够的时间响应）
  setTimeout(() => { isInternalSave = false }, 1000)
}

const handleFileChanged = async (event: FileChangedEvent) => {
  if (isInternalSave) {
    console.log('[File Watcher] Internal save detected, skipping reload')
    return
  }
  
  console.log('[File Watcher] External modification detected, reloading...')
  
  // 外部修改，重新加载
  const markdown = await fileSystemService.readFile(currentFilePath)
  const nodes = adapter.parseMarkdownToNodes(markdown)
  setNodes(nodes)
  
  showToast('文件已被外部修改，已自动刷新')
}
```

**验收标准**:
- [ ] 用户编辑 → 保存 → 不触发重新加载（日志显示 "Internal save detected"）
- [ ] 外部修改（如在 VS Code 中编辑）→ 触发重新加载
- [ ] 无无限循环（连续保存多次不会死循环）
- [ ] 标志位在 1 秒后正确重置

---

### Task 5.6: 实现编辑冲突检测 ⭐
**类型**: Implementation  
**文件**: `src/components/ConflictDialog.tsx`, `src/hooks/useConflictDetection.ts`

**冲突检测逻辑**:
```typescript
// 跟踪本地编辑状态
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
const [lastSavedContent, setLastSavedContent] = useState('')
const [showConflictDialog, setShowConflictDialog] = useState(false)
const [externalContent, setExternalContent] = useState('')

// 文件监听回调
const handleFileChanged = async (event: FileChangedEvent) => {
  // 如果是内部保存，跳过
  if (isInternalSave) return
  
  // 读取外部修改的内容
  const newContent = await fileSystemService.readFile(currentFilePath)
  
  // 检查是否有未保存的本地修改
  if (hasUnsavedChanges) {
    // 冲突！显示对话框
    setExternalContent(newContent)
    setShowConflictDialog(true)
  } else {
    // 无冲突，直接重新加载
    reloadFile(newContent)
  }
}

// 编辑器内容变化时
const handleContentChange = (content: string) => {
  setHasUnsavedChanges(content !== lastSavedContent)
}

// 保存成功后
const handleSaveSuccess = (content: string) => {
  setLastSavedContent(content)
  setHasUnsavedChanges(false)
}
```

**冲突对话框组件**:
```typescript
interface ConflictDialogProps {
  localContent: string
  externalContent: string
  lastSavedContent: string
  onKeepLocal: () => void
  onLoadExternal: () => void
  onShowDiff: () => void
  onCancel: () => void
}

export const ConflictDialog: React.FC<ConflictDialogProps> = ({
  localContent,
  externalContent,
  lastSavedContent,
  onKeepLocal,
  onLoadExternal,
  onShowDiff,
  onCancel
}) => {
  return (
    <Dialog>
      <DialogTitle>⚠️ 文件冲突</DialogTitle>
      <DialogContent>
        <Warning>
          文件已被外部修改，但您有未保存的本地编辑。
        </Warning>
        
        <InfoBox>
          <div>本地修改：{getWordCount(localContent - lastSavedContent)} 字变更</div>
          <div>外部修改：{getWordCount(externalContent - lastSavedContent)} 字变更</div>
        </InfoBox>
        
        <p>请选择如何处理：</p>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button onClick={onLoadExternal} warning>
          加载外部更改（丢弃本地编辑）
        </Button>
        <Button onClick={onShowDiff}>
          并排查看（手动合并）
        </Button>
        <Button onClick={onKeepLocal} primary>
          保留我的修改（覆盖文件）
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

**Diff 查看器**（可选，使用 react-diff-viewer）:
```typescript
import ReactDiffViewer from 'react-diff-viewer'

const DiffViewer: React.FC = ({ oldValue, newValue }) => {
  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      splitView={true}
      showDiffOnly={false}
      leftTitle="外部更改"
      rightTitle="本地修改"
    />
  )
}
```

**验收标准**:
- [ ] 检测到外部修改 + 本地有未保存编辑时显示冲突对话框
- [ ] 对话框显示本地和外部的变更字数
- [ ] "保留本地修改"选项正常工作（覆盖文件）
- [ ] "加载外部更改"选项正常工作（丢弃本地编辑）
- [ ] "并排查看"选项正常工作（显示 diff）
- [ ] 无未保存编辑时不显示冲突对话框（直接重新加载）

---

### Task 5.7: 实现 AI 生成状态检测 ⭐
**类型**: Implementation  
**文件**: `src/hooks/useAIGenerationDetection.ts`, `src/components/Node.tsx`

**检测策略实现**:
```typescript
// 跟踪文件变化历史
const fileChangeHistory = new Map<string, number[]>() // path -> [timestamp1, timestamp2, ...]
const [aiGeneratingPaths, setAIGeneratingPaths] = useState<Set<string>>(new Set())

const handleFileChanged = (event: FileChangedEvent) => {
  const { path, size, timestamp } = event.payload
  const now = timestamp || Date.now()
  
  // 获取该文件的变化历史
  const history = fileChangeHistory.get(path) || []
  history.push(now)
  
  // 保留最近 3 秒的历史
  const recentHistory = history.filter(t => now - t < 3000)
  fileChangeHistory.set(path, recentHistory)
  
  // 检测是否为 AI 生成（3 秒内 > 3 次变化）
  const isAIGenerating = recentHistory.length > 3
  
  if (isAIGenerating) {
    // 标记为 AI 生成中
    setAIGeneratingPaths(prev => new Set(prev).add(path))
    setNodeStatus(path, 'ai-generating')
  } else {
    // 生成完成，移除标记
    setAIGeneratingPaths(prev => {
      const newSet = new Set(prev)
      newSet.delete(path)
      return newSet
    })
    setNodeStatus(path, 'completed')
  }
  
  // 3 秒后清理历史（防止内存泄漏）
  setTimeout(() => {
    const currentHistory = fileChangeHistory.get(path) || []
    const cleanedHistory = currentHistory.filter(t => Date.now() - t < 3000)
    if (cleanedHistory.length === 0) {
      fileChangeHistory.delete(path)
    } else {
      fileChangeHistory.set(path, cleanedHistory)
    }
  }, 3000)
}
```

**UI 反馈组件**:
```typescript
// 在 Node 组件中
const Node: React.FC<NodeProps> = ({ node }) => {
  const isAIGenerating = node.data.status === 'ai-generating'
  
  return (
    <div className={`node-card ${isAIGenerating ? 'ai-generating' : ''}`}>
      <div className="card-header">
        {/* 图标 */}
        <span className={`icon ${isAIGenerating ? 'rotating' : ''}`}>
          {isAIGenerating ? '⚡' : getNodeIcon(node.type)}
        </span>
        
        {/* 标题 */}
        <span className="title">{node.data.label}</span>
        
        {/* AI 生成中徽章 */}
        {isAIGenerating && (
          <span className="ai-badge pulse">
            ⚡ 生成中
          </span>
        )}
      </div>
      
      {/* 内容区域（生成中时禁止编辑） */}
      <div className={`card-content ${isAIGenerating ? 'locked' : ''}`}>
        {isAIGenerating && <LockOverlay>AI 正在生成内容，请稍候...</LockOverlay>}
        {/* ... */}
      </div>
    </div>
  )
}
```

**样式**:
```css
.node-card.ai-generating {
  border: 2px solid #1890ff;
  box-shadow: 0 0 10px rgba(24, 144, 255, 0.3);
  animation: pulse-border 1.5s infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: #1890ff; }
  50% { border-color: #40a9ff; }
}

.icon.rotating {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.ai-badge.pulse {
  animation: pulse-badge 1.5s infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.card-content.locked {
  pointer-events: none;
  opacity: 0.6;
}
```

**验收标准**:
- [ ] 检测到连续快速文件变化时标记为"AI 生成中"（3 秒内 > 3 次）
- [ ] 节点显示脉冲动画（蓝色边框）
- [ ] 图标旋转或显示 ⚡ 徽章
- [ ] 节点锁定（禁止编辑）
- [ ] 生成完成后（3 秒内无新变化）恢复正常状态
- [ ] 不会误检测正常编辑（单次保存不会触发）
- [ ] 内存正常释放（文件历史定期清理）

---

### Checkpoint - Phase 5
- [ ] Tauri 桌面应用正常运行
- [ ] 文件读写功能正常
- [ ] 文件监听检测到外部修改（500ms 内响应）
- [ ] 无编辑循环问题（内部保存不触发重新加载）
- [ ] 编辑冲突检测正常（显示冲突对话框，三种解决方案可用）
- [ ] AI 生成状态检测正常（节点显示"生成中"动画，生成完成后恢复）

---

## Phase 6: 思维导图布局优化（1-2 天）

### Task 6.1: 分析 flowgram.ai 布局算法
**类型**: Research  
**文件**: flowgram.ai 的 `layout.ts` 或相关文件

**研究内容**:
- 当前布局方式（网格/自由/层次）
- 布局配置参数
- 如何自定义布局算法

**输出**: 文档 `docs/layout-analysis.md`

**验收标准**:
- [ ] 理解 flowgram.ai 的布局机制
- [ ] 找到布局算法代码
- [ ] 确定如何扩展或替换

---

### Task 6.2: 实现思维导图布局算法
**类型**: Implementation  
**文件**: `src/layouts/MindMapLayout.ts`

**算法**:
```typescript
export function mindMapLayout(nodes: SpecKitFlowNode[]): SpecKitFlowNode[] {
  const LEVEL_WIDTH = 300  // X 轴层级间距
  const NODE_HEIGHT = 80   // Y 轴节点间距
  
  const layoutNode = (node: SpecKitFlowNode, depth: number, index: number) => {
    // X 坐标：根据层级
    node.position.x = depth * LEVEL_WIDTH
    
    // Y 坐标：根据同级索引
    node.position.y = index * NODE_HEIGHT
    
    // 递归处理子节点
    if (node.children) {
      node.children.forEach((childId, i) => {
        const child = nodes.find(n => n.id === childId)
        if (child) {
          layoutNode(child, depth + 1, i)
        }
      })
    }
  }
  
  // 找到根节点
  const roots = nodes.filter(n => !nodes.some(p => p.children?.includes(n.id)))
  roots.forEach((root, i) => layoutNode(root, 0, i))
  
  return nodes
}
```

**验收标准**:
- [ ] 节点从左到右排列
- [ ] 层级间距合理（300px）
- [ ] 无节点重叠
- [ ] 布局美观

---

### Task 6.3: 集成到 flowgram.ai 布局引擎
**类型**: Implementation  
**文件**: flowgram.ai 的 layout 相关文件

**集成方式**:
- 添加布局模式选项（网格/思维导图）
- 默认使用思维导图布局
- 用户可以切换布局模式

**验收标准**:
- [ ] 打开 spec.md → 自动应用思维导图布局
- [ ] 布局算法正确调用
- [ ] 用户拖拽后保存自定义位置

---

### Checkpoint - Phase 6
- [ ] 思维导图布局算法实现
- [ ] 节点从左到右排列
- [ ] 层级关系清晰
- [ ] 集成到 flowgram.ai

---

## Phase 7: 性能优化和虚拟化（1-2 天）

### Task 7.1: 实现虚拟化渲染
**类型**: Implementation  
**文件**: `src/hooks/useVirtualization.ts`

**虚拟化逻辑**:
```typescript
export function useVirtualization(
  allNodes: SpecKitFlowNode[],
  viewport: Viewport
): SpecKitFlowNode[] {
  return useMemo(() => {
    return allNodes.filter(node => {
      const nodeScreenX = (node.position.x - viewport.x) * viewport.zoom
      const nodeScreenY = (node.position.y - viewport.y) * viewport.zoom
      
      const nodeWidth = node.size?.width || 200
      const nodeHeight = node.size?.height || 80
      
      return (
        nodeScreenX + nodeWidth > 0 &&
        nodeScreenX < window.innerWidth &&
        nodeScreenY + nodeHeight > 0 &&
        nodeScreenY < window.innerHeight
      )
    })
  }, [allNodes, viewport])
}
```

**验收标准**:
- [ ] 仅渲染可见区域节点
- [ ] 滚动时节点动态加载
- [ ] 500+ 节点无卡顿

---

### Task 7.2: 优化 React 渲染
**类型**: Implementation  
**文件**: 各组件文件

**优化措施**:
```typescript
// 1. 使用 React.memo
const Node = React.memo(NodeComponent, (prev, next) => {
  return prev.node.position.x === next.node.position.x &&
         prev.node.position.y === next.node.position.y &&
         prev.node.data.content === next.node.data.content
})

// 2. 使用 useCallback
const handleNodeClick = useCallback((nodeId: string) => {
  selectNode(nodeId)
}, [])

// 3. 懒加载编辑器
const RichTextEditor = lazy(() => import('./RichTextEditor'))
```

**验收标准**:
- [ ] 不必要的重渲染减少（使用 React DevTools Profiler）
- [ ] 拖拽帧率 60fps
- [ ] 内存占用合理

---

### Task 7.3: 性能测试
**类型**: Test  
**文件**: `tests/performance.test.ts`

**测试场景**:
- 解析 1000 行 spec.md
- 渲染 100 个节点
- 拖拽节点（测量帧率）
- 500+ 节点虚拟化渲染

**验收标准**:
- [ ] 解析 1000 行 < 100ms
- [ ] 渲染 100 节点 < 2s
- [ ] 拖拽帧率 60fps
- [ ] 500+ 节点无卡顿

---

### Checkpoint - Phase 7
- [ ] 虚拟化渲染实现
- [ ] React 性能优化完成
- [ ] 所有性能指标达标

---

## Phase 8: 测试和文档（2-3 天）

### Task 8.1: 编写单元测试
**类型**: Test  
**文件**: `src/**/__tests__/*.test.ts`

**测试覆盖**:
- MarkdownAdapter（往返测试）: 90%+
- SpecKitRecognizer（模式识别）: 85%+
- RichTextEditor（格式化操作）: 80%+

**验收标准**:
- [ ] 所有单元测试通过
- [ ] 覆盖率 > 80%

---

### Task 8.2: 编写集成测试
**类型**: Test  
**文件**: `tests/integration/*.test.ts`

**测试场景**:
- 打开文件 → 显示 → 编辑 → 保存 → 验证文件
- 外部修改 → 自动刷新
- 多个节点编辑流程

**验收标准**:
- [ ] 完整流程测试通过
- [ ] 文件监听测试通过

---

### Task 8.3: 编写 E2E 测试
**类型**: Test  
**文件**: `e2e/*.spec.ts`

**使用 Playwright**:
```typescript
test('用户打开 spec.md 并编辑', async ({ page }) => {
  await page.goto('http://localhost:5173')
  
  // 点击"打开文件"
  await page.click('[data-testid="open-file"]')
  
  // 选择 spec.md（使用 mock）
  // ...
  
  // 验证节点显示
  await expect(page.locator('.node-card')).toHaveCount(10)
  
  // 点击节点
  await page.click('.node-card:first-child')
  
  // 验证配置面板展开
  await expect(page.locator('.properties-panel')).toBeVisible()
  
  // 编辑内容
  await page.fill('.tiptap', '新内容')
  
  // 等待自动保存
  await page.waitForTimeout(1500)
  
  // 验证保存成功
  await expect(page.locator('.save-indicator')).toContainText('已保存')
})
```

**验收标准**:
- [ ] 打开文件流程测试通过
- [ ] 编辑流程测试通过
- [ ] 保存流程测试通过
- [ ] 所有 E2E 测试通过

---

### Task 8.4: 编写用户文档
**类型**: Documentation  
**文件**: `docs/user-guide.md`, `README.md`

**文档内容**:
1. **快速开始**
   - 安装
   - 打开第一个 Markdown 文件
   - 基础操作
   
2. **功能说明**
   - 思维导图可视化
   - 富文本编辑
   - 节点操作
   
3. **快捷键列表**
   - Ctrl+B/I 等编辑快捷键
   - 画布操作快捷键

**验收标准**:
- [ ] README.md 更新完整
- [ ] 用户指南清晰易懂
- [ ] 包含截图和示例

---

### Task 8.5: 编写技术文档
**类型**: Documentation  
**文件**: `docs/architecture.md`, `docs/flowgram-integration.md`

**文档内容**:
1. **架构说明**（architecture.md）
   - 三层架构图
   - 数据流图
   - 组件关系图
   
2. **flowgram.ai 集成说明**（flowgram-integration.md）
   - 复用的模块列表
   - 扩展的组件说明
   - 修改点清单
   
3. **Markdown 适配器文档**（markdown-adapter.md）
   - 双向转换原理
   - spec-kit 识别规则
   - 往返测试说明

**验收标准**:
- [ ] 架构文档完整
- [ ] 技术文档清晰
- [ ] 开发者能根据文档理解项目

---

### Checkpoint - Phase 8
- [ ] 所有单元测试通过
- [ ] 所有集成测试通过
- [ ] 所有 E2E 测试通过
- [ ] 测试覆盖率 > 80%
- [ ] 用户文档完整
- [ ] 技术文档完整

---

## 总结

### 任务统计

**总任务数**: 约 52 个任务
- **MVP（P1 功能）**: 38 个任务
- **P2 功能**: 14 个任务（Phase 3.5: 6个 + Phase 5: 3个新增 + Phase 5: 5个扩展）

**预计时间**:
- **MVP（P1 功能）**: 10-15 工作日
- **完整 V1.0（P1 + P2）**: 12-18 工作日

### 关键路径

**MVP 路径**（仅 P1 功能）:
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 6 → Phase 7 → Phase 8
```

**V1.0 路径**（P1 + P2 功能）:
```
Phase 1 → Phase 2 → Phase 3 → (Phase 3.5) → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8
```

### 任务优先级

#### P0（阻塞任务）
- **Phase 1**: 项目准备和 flowgram.ai 集成（阻塞所有后续任务）
  - Task 1.1 ~ 1.5（5 个任务）

#### P1（MVP 核心功能）
- **Phase 2**: Markdown 适配层（7 个任务）
- **Phase 3**: 卡片节点扩展（4 个任务，含折叠/展开）
- **Phase 4**: TipTap 富文本编辑器（5 个任务）
- **Phase 5**: Tauri 桌面化（基础功能，4 个任务：5.1 ~ 5.4）
- **Phase 6**: 思维导图布局（3 个任务）
- **Phase 7**: 性能优化（3 个任务）
- **Phase 8**: 测试和文档（5 个任务）

**小计**: 36 个 P1 任务

#### P2（增强功能，可选）
- **Phase 3.5**: 节点增删管理（6 个任务）⭐ 可根据 MVP 进度选择实施或延后
- **Phase 5**: 编辑冲突检测（Task 5.6）
- **Phase 5**: AI 生成状态检测（Task 5.7）
- **Phase 5**: 编辑循环避免细化（Task 5.5 扩展）

**小计**: 9 个 P2 任务

#### P3（未来功能，暂不包含在本计划）
- AI 校验集成
- CLI 工具集成框架

### 并行可能性

**方案 A**（快速交付 MVP）:
- Phase 1 → 2 → 3 → 4 → 6 → 7 → 8
- 跳过 Phase 3.5 和 Phase 5 的 P2 功能
- **预计时间**: 10-12 工作日

**方案 B**（有限并行）:
- Phase 5（Tauri 基础）可以与 Phase 4（TipTap）并行（节省 1-2 天）
- Phase 6（布局）可以与 Phase 4 后期并行
- **预计时间**: 10-13 工作日

**方案 C**（完整 V1.0，包含 P2 功能）:
- Phase 1 → 2 → 3 → 3.5 → 4 → 5（完整）→ 6 → 7 → 8
- 如果团队资源充足，Phase 3.5 可以与 Phase 4 并行
- **预计时间**: 12-18 工作日

### 实施建议

1. **优先交付 MVP**（方案 A 或 B）
   - 聚焦 P1 功能，快速验证核心价值
   - 用户可以开始使用基础的可视化和编辑功能
   - 预计 10-13 工作日

2. **迭代增强（Phase 3.5 + Phase 5 P2）**
   - MVP 稳定后实施 P2 功能
   - 额外 2-3 工作日
   - 完善文档管理体验

3. **未来规划（P3 功能）**
   - 根据用户反馈决定是否实施
   - AI 校验、CLI 集成等高级功能

### 风险提示

- **Phase 1 的 flowgram.ai 研究**：如果其架构不兼容，可能需要额外 1-2 天适配
- **Phase 2 的 Markdown 往返测试**：必须确保无损转换，否则影响所有后续功能
- **Phase 5 的文件监听**：跨平台兼容性测试可能需要额外时间
- **Phase 3.5（P2 功能）**：如果实施，建议在 MVP 稳定后进行，避免拖延核心交付

---

**任务分解版本**: v1.1（补充 P2 功能和细化实现）  
**基于**: plan.md v1.1（已确认）  
**创建时间**: 2025-10-31  
**最后更新**: 2025-10-31  
**变更摘要**:
- 新增 Phase 3.5（节点增删管理，6 个任务，P2 功能）
- 补充 Phase 3（节点折叠/展开，Task 3.4）
- 补充 Phase 5（编辑冲突检测 Task 5.6，AI 状态检测 Task 5.7）
- 更新 Task 2.5（SpecKit 识别器，支持 7 种模式）
- 更新任务统计（从 40 个增至 52 个）
- 更新时间估算（MVP 10-15 天，V1.0 12-18 天）
- 新增实施建议和并行方案

**状态**: ✅ 已完成，等待用户确认（STEP 6）

