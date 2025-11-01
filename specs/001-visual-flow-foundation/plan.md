# Visual Flow Foundation - 实施计划

**基于**: spec.md v2.0（已确认）  
**创建时间**: 2025-10-31  
**预计工期**: 10-15 工作日  
**核心策略**: 基于 flowgram.ai demo-free-layout 改造，复用核心功能，最小化开发工作量

---

## 架构概述

### 改造策略

本项目**不从零开始**，而是基于成熟的 flowgram.ai demo-free-layout 项目进行改造。核心原则：

1. ✅ **复用而非重写**：flowgram.ai 的卡片渲染、配置面板、拖拽、布局等核心功能直接使用
2. ✅ **扩展而非替换**：在 flowgram.ai 基础上新增 Markdown 适配层和 TipTap 富文本编辑器
3. ✅ **尊崇而非背离**：遵循 flowgram.ai 的架构规范、组件结构、数据格式

### 高层架构

```
┌─────────────────────────────────────────────────────────────┐
│                    flowgram.ai 核心层（复用）⭐              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Card Node    │  │ Properties   │  │ Layout       │      │
│  │ Renderer     │  │ Panel        │  │ Engine       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Drag & Drop  │  │ Canvas       │  │ Data Save/   │      │
│  │ Handler      │  │ Interaction  │  │ Load         │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ 不改动，直接复用
┌─────────────────────────────────────────────────────────────┐
│                   扩展层（新增，最小化改动）                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Markdown     │  │ SpecKit      │  │ TipTap       │      │
│  │ Adapter      │  │ Recognizer   │  │ Editor       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ AST 处理
┌─────────────────────────────────────────────────────────────┐
│                   Markdown AST 层（数据源）                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ remark-parse │  │ remark-      │  │ Tauri File   │      │
│  │ (Md → AST)   │  │ stringify    │  │ System       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 数据流

#### 加载文档流程
```
1. 用户选择 spec.md 文件
    ↓
2. Tauri File System API 读取文件内容（string）
    ↓
3. remark-parse 解析为 Markdown AST（Root）
    ↓
4. Markdown Adapter 转换为 flowgram.ai 节点格式（Node[]）
    ↓
5. SpecKit Recognizer 识别用户故事、优先级等元数据
    ↓
6. flowgram.ai Layout Engine 计算节点位置（思维导图布局）
    ↓
7. flowgram.ai Card Node Renderer 渲染卡片节点（SVG/Canvas）
```

#### 编辑保存流程
```
1. 用户点击卡片节点
    ↓
2. flowgram.ai Properties Panel 自动展开
    ↓
3. TipTap Editor 加载节点内容（Markdown → 富文本）
    ↓
4. 用户使用工具栏按钮编辑（加粗、列表等）
    ↓
5. TipTap 自动转换为 Markdown（富文本 → Markdown）
    ↓
6. Markdown Adapter 更新 flowgram.ai 节点数据
    ↓
7. Markdown Adapter 转换为 Markdown AST
    ↓
8. remark-stringify 序列化为 Markdown 文本
    ↓
9. Tauri File System API 写入文件（防抖 1 秒）
    ↓
10. 文件监听检测到变化（区分内部/外部修改）
```

---

## 核心组件设计

### Component 1: flowgram.ai 核心（复用，不改动）

#### 1.1 项目结构分析

基于 flowgram.ai demo-free-layout 的典型结构（推测）：

```
flowgram.ai/apps/demo-free-layout/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx           # 画布组件（缩放、平移）
│   │   ├── Node.tsx             # 卡片节点组件
│   │   ├── Edge.tsx             # 连线组件
│   │   ├── PropertiesPanel.tsx # 配置面板 ⭐ 我们要扩展
│   │   └── Toolbar.tsx          # 工具栏
│   ├── hooks/
│   │   ├── useDrag.ts           # 拖拽逻辑
│   │   └── useLayout.ts         # 布局算法
│   ├── types/
│   │   └── node.ts              # 节点数据格式 ⭐ 我们要兼容
│   ├── utils/
│   │   ├── layout.ts            # 布局算法
│   │   └── storage.ts           # 数据保存/加载 ⭐ 我们要复用
│   └── App.tsx
└── package.json
```

#### 1.2 关键数据格式（需要兼容）

```typescript
// flowgram.ai 的节点数据格式（推测）
interface FlowgramNode {
  id: string
  type: string                // 节点类型
  position: { x: number; y: number }
  size?: { width: number; height: number }
  data: {
    label?: string            // 标题
    content?: string          // 内容
    [key: string]: any        // 可扩展属性 ⭐ 我们在这里添加 spec-kit 元数据
  }
  children?: string[]         // 子节点 ID 列表
}

// 我们的扩展
interface SpecKitFlowNode extends FlowgramNode {
  data: {
    label: string             // 节点标题
    content: string           // 完整内容（Markdown）
    preview: string           // 内容预览（前 50 字）
    
    // spec-kit 扩展元数据
    priority?: 'P1' | 'P2' | 'P3'
    storyNumber?: number
    requirementId?: string
    status?: 'draft' | 'completed' | 'ai-generating'
    wordCount?: number
    lastModified?: number
    
    // AST 引用（用于双向转换）
    astNodeRef?: any          // 保留原始 Markdown AST 节点
  }
}
```

#### 1.3 复用的核心功能

| flowgram.ai 功能 | 用途 | 是否修改 |
|-----------------|------|---------|
| Canvas.tsx | 画布渲染（缩放、平移） | ❌ 不修改 |
| Node.tsx | 卡片节点渲染 | ⚠️ 扩展：添加优先级徽章、元数据显示 |
| Edge.tsx | 连线渲染 | ❌ 不修改 |
| PropertiesPanel.tsx | 配置面板 | ⚠️ 扩展：集成 TipTap 编辑器 |
| useDrag.ts | 拖拽逻辑 | ❌ 不修改 |
| layout.ts | 布局算法 | ⚠️ 可能需要调整为思维导图布局（从左到右） |
| storage.ts | 数据保存/加载 | ❌ 不修改 |

---

### Component 2: Markdown 适配层（新增）

**职责**: Markdown AST ↔ flowgram.ai 节点格式的双向转换

**关键文件**:
- `src/adapters/MarkdownAdapter.ts`
- `src/types/markdown.ts`

**核心接口**:

```typescript
export interface MarkdownAdapter {
  // Markdown 文件 → flowgram.ai 节点
  parseMarkdownToNodes(markdown: string): Promise<SpecKitFlowNode[]>
  
  // flowgram.ai 节点 → Markdown 文件
  buildNodesToMarkdown(nodes: SpecKitFlowNode[]): Promise<string>
}

export class UnifiedMarkdownAdapter implements MarkdownAdapter {
  private parser: unified.Processor
  private stringifier: unified.Processor
  
  constructor() {
    this.parser = unified()
      .use(remarkParse)
      .use(remarkGfm)
    
    this.stringifier = unified()
      .use(remarkStringify, {
        bullet: '-',
        fence: '`',
        fences: true
      })
  }
  
  async parseMarkdownToNodes(markdown: string): Promise<SpecKitFlowNode[]> {
    // 1. 解析为 AST
    const ast = this.parser.parse(markdown)
    
    // 2. 遍历 AST，提取标题层级
    const nodes: SpecKitFlowNode[] = []
    const nodeMap = new Map<number, SpecKitFlowNode>() // depth → current node
    
    visit(ast, (node, index, parent) => {
      if (node.type === 'heading') {
        const flowNode = this.createNodeFromHeading(node as Heading)
        
        // 建立父子关系
        const parentDepth = node.depth - 1
        if (parentDepth > 0 && nodeMap.has(parentDepth)) {
          const parentNode = nodeMap.get(parentDepth)!
          parentNode.children = parentNode.children || []
          parentNode.children.push(flowNode.id)
        }
        
        nodeMap.set(node.depth, flowNode)
        nodes.push(flowNode)
      }
    })
    
    return nodes
  }
  
  private createNodeFromHeading(heading: Heading): SpecKitFlowNode {
    const text = mdastToString(heading)
    
    return {
      id: generateId(text),
      type: 'heading',
      position: { x: 0, y: 0 }, // 稍后由 layout engine 计算
      data: {
        label: text,
        content: text,
        preview: text.slice(0, 50),
        astNodeRef: heading  // 保留引用，用于反向转换
      }
    }
  }
  
  async buildNodesToMarkdown(nodes: SpecKitFlowNode[]): Promise<string> {
    // 1. 重建 AST
    const ast: Root = {
      type: 'root',
      children: []
    }
    
    // 2. 从节点树重建标题层级
    const traverse = (node: SpecKitFlowNode, depth: number) => {
      if (node.type === 'heading' || node.type === 'user-story') {
        ast.children.push({
          type: 'heading',
          depth: depth,
          children: [
            { type: 'text', value: node.data.label }
          ]
        })
      }
      
      // 递归处理子节点
      if (node.children) {
        node.children.forEach(childId => {
          const childNode = nodes.find(n => n.id === childId)
          if (childNode) {
            traverse(childNode, depth + 1)
          }
        })
      }
    }
    
    // 找到根节点（depth = 1）
    const rootNodes = nodes.filter(n => !nodes.some(p => p.children?.includes(n.id)))
    rootNodes.forEach(root => traverse(root, 1))
    
    // 3. 序列化为 Markdown
    return this.stringifier.stringify(ast)
  }
}
```

**关键挑战**:
- ✅ **双向转换无损**：必须编写全面的往返测试（Markdown → AST → Nodes → AST → Markdown）
- ✅ **保留 AST 引用**：在 flowgram.ai 节点的 `data.astNodeRef` 中保存原始 AST 节点，用于反向转换时保留格式

---

### Component 3: SpecKit 识别器（新增）

**职责**: 识别 spec-kit 特定模式（用户故事、优先级、验收场景等）

**关键文件**:
- `src/speckit/SpecKitRecognizer.ts`
- `src/speckit/patterns.ts`

**核心接口**:

```typescript
export interface SpecKitPattern {
  type: 'user-story' | 'acceptance-scenario' | 'functional-requirement' | 'success-criteria' | 'boundary-case' | 'task' | 'priority-marker'
  match: RegExp
  extract: (text: string) => Record<string, any>
}

export const SPEC_KIT_PATTERNS: SpecKitPattern[] = [
  {
    type: 'user-story',
    match: /^用户故事 (\d+) - (.+)（优先级：(P\d+)）$/,
    extract: (text) => {
      const match = text.match(/^用户故事 (\d+) - (.+)（优先级：(P\d+)）$/)
      if (!match) return {}
      return {
        storyNumber: parseInt(match[1]),
        title: match[2],
        priority: match[3]
      }
    }
  },
  {
    type: 'acceptance-scenario',
    match: /^验收场景$/,
    extract: () => ({ isAcceptanceSection: true })
  },
  {
    type: 'functional-requirement',
    match: /^- \*\*FR-(\d+)\*\*:/,
    extract: (text) => {
      const match = text.match(/^- \*\*FR-(\d+)\*\*:/)
      return { requirementId: match ? `FR-${match[1]}` : undefined }
    }
  },
  {
    type: 'success-criteria',
    match: /^- \*\*SC-(\d+)\*\*:/,
    extract: (text) => {
      const match = text.match(/^- \*\*SC-(\d+)\*\*:/)
      return { criteriaId: match ? `SC-${match[1]}` : undefined }
    }
  },
  {
    type: 'boundary-case',
    match: /^边界情况$/,
    extract: () => ({ isBoundarySection: true })
  },
  {
    type: 'task',
    match: /^- \[ \] (.+)$/,
    extract: (text) => {
      const match = text.match(/^- \[ \] (.+)$/)
      return { taskDescription: match ? match[1] : undefined, completed: false }
    }
  },
  {
    type: 'priority-marker',
    match: /（优先级：(P\d+)）/,
    extract: (text) => {
      const match = text.match(/（优先级：(P\d+)）/)
      return { priority: match ? match[1] : undefined }
    }
  }
]

export class SpecKitRecognizer {
  recognize(node: SpecKitFlowNode): SpecKitFlowNode {
    const text = node.data.label || ''
    
    for (const pattern of SPEC_KIT_PATTERNS) {
      if (pattern.match.test(text)) {
        const metadata = pattern.extract(text)
        
        // 更新节点类型和元数据
        node.type = pattern.type
        node.data = {
          ...node.data,
          ...metadata
        }
        
        break
      }
    }
    
    return node
  }
  
  recognizeAll(nodes: SpecKitFlowNode[]): SpecKitFlowNode[] {
    return nodes.map(node => this.recognize(node))
  }
}
```

---

### Component 4: TipTap 富文本编辑器（集成到 flowgram.ai 配置面板）

**职责**: 提供所见即所得的编辑体验，集成到 flowgram.ai 的 PropertiesPanel

**关键文件**:
- `src/components/RichTextEditor.tsx`（新增）
- `src/components/PropertiesPanel.tsx`（扩展 flowgram.ai 原有组件）

**核心实现**:

```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

interface RichTextEditorProps {
  value: string              // Markdown 内容
  onChange: (markdown: string) => void
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,              // 基础扩展（标题、加粗、列表等）
      Markdown                 // Markdown 双向转换
    ],
    content: value,            // 初始内容（Markdown，自动转换为富文本）
    onUpdate: ({ editor }) => {
      // 自动转换为 Markdown
      const markdown = editor.storage.markdown.getMarkdown()
      onChange(markdown)
    }
  })
  
  if (!editor) return null
  
  return (
    <div className="rich-text-editor">
      {/* 格式化工具栏 */}
      <EditorToolbar editor={editor} />
      
      {/* 富文本编辑器 */}
      <EditorContent editor={editor} />
    </div>
  )
}

// 工具栏组件
interface EditorToolbarProps {
  editor: Editor
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'active' : ''}
      >
        <strong>B</strong>
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'active' : ''}
      >
        <em>I</em>
      </button>
      
      <select
        onChange={(e) => {
          const level = parseInt(e.target.value) as 1 | 2 | 3
          editor.chain().focus().toggleHeading({ level }).run()
        }}
      >
        <option value="">正文</option>
        <option value="1">标题 1</option>
        <option value="2">标题 2</option>
        <option value="3">标题 3</option>
      </select>
      
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
        • 列表
      </button>
      
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        &lt;&gt; 代码
      </button>
      
      {/* ... 更多按钮 */}
    </div>
  )
}
```

**集成到 flowgram.ai PropertiesPanel**:

```typescript
// 扩展 flowgram.ai 的 PropertiesPanel
// 原文件：flowgram.ai/src/components/PropertiesPanel.tsx

// 修改方案：最小化侵入
// 1. 检测节点类型，如果是 spec-kit 节点，使用 TipTap 编辑器
// 2. 否则，使用 flowgram.ai 原有的编辑器

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ node }) => {
  // flowgram.ai 原有逻辑
  // ...
  
  // 我们的扩展：检测是否为 spec-kit 节点
  const isSpecKitNode = node.type === 'heading' || node.type === 'user-story'
  
  return (
    <div className="properties-panel">
      <h3>节点配置</h3>
      
      {/* flowgram.ai 原有的基础属性编辑 */}
      <NodeProperties node={node} />
      
      {/* 我们的扩展：spec-kit 节点使用 TipTap */}
      {isSpecKitNode ? (
        <RichTextEditor
          value={node.data.content || ''}
          onChange={(markdown) => updateNodeContent(node.id, markdown)}
        />
      ) : (
        {/* flowgram.ai 原有的编辑器 */}
        <DefaultEditor node={node} />
      )}
    </div>
  )
}
```

---

### Component 5: Tauri 桌面框架（文件系统集成）

**职责**: 提供文件读写和监听能力

**关键文件**:
- `src-tauri/src/main.rs`
- `src-tauri/src/fs_commands.rs`
- `src-tauri/src/watcher.rs`

**核心命令**:

```rust
// src-tauri/src/fs_commands.rs

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
        .set_title("选择 Markdown 文件")
        .pick_file()
        .and_then(|path| path.to_str().map(|s| s.to_string()))
}
```

**文件监听**:

```rust
// src-tauri/src/watcher.rs

use notify::{Watcher, RecursiveMode, Event};
use tauri::{AppHandle, Manager};

pub fn start_file_watcher(app_handle: AppHandle, path: String) -> notify::Result<()> {
    let (tx, rx) = std::sync::mpsc::channel();
    
    let mut watcher = notify::recommended_watcher(move |res: notify::Result<Event>| {
        tx.send(res).unwrap();
    })?;
    
    watcher.watch(std::path::Path::new(&path), RecursiveMode::NonRecursive)?;
    
    std::thread::spawn(move || {
        loop {
            match rx.recv() {
                Ok(Ok(event)) => {
                    // 发送事件到前端
                    app_handle.emit_all("file-changed", event).unwrap();
                }
                _ => {}
            }
        }
    });
    
    Ok(())
}
```

---

## 实施阶段

### Phase 1: 项目准备和 flowgram.ai 集成（2-3 天）

**目标**: Fork flowgram.ai 项目，建立开发环境

**任务**:
1. Fork flowgram.ai demo-free-layout 到我们的仓库
2. 克隆项目到本地
3. 安装依赖并运行原始项目，确保能正常工作
4. 研究项目结构：
   - 节点数据格式（types/node.ts）
   - 配置面板组件（components/PropertiesPanel.tsx）
   - 布局算法（utils/layout.ts）
   - 数据保存/加载（utils/storage.ts）
5. 创建扩展目录：
   - `src/adapters/` - Markdown 适配器
   - `src/speckit/` - spec-kit 识别器
   - `src/components/RichTextEditor.tsx` - TipTap 编辑器
6. 安装新依赖：
   - `npm install unified remark-parse remark-stringify remark-gfm mdast-util-to-string unist-util-visit`
   - `npm install @tiptap/react @tiptap/starter-kit tiptap-markdown`

**验收标准**:
- [ ] flowgram.ai 原始项目能正常运行
- [ ] 理解其节点数据格式和组件结构
- [ ] 所有新依赖安装成功
- [ ] 项目结构清晰，扩展目录已创建

**输出**: 可运行的 flowgram.ai 项目 + 扩展目录骨架

---

### Phase 2: Markdown 适配层实现（3-4 天）

**目标**: 实现 Markdown ↔ flowgram.ai 节点的双向转换

**任务**:
1. 实现 `MarkdownAdapter.parseMarkdownToNodes`
   - 使用 remark-parse 解析 Markdown 为 AST
   - 遍历 AST，提取标题层级
   - 转换为 flowgram.ai 节点格式
   - 建立父子关系（children 数组）
2. 实现 `MarkdownAdapter.buildNodesTo Markdown`
   - 从节点树重建 Markdown AST
   - 使用 remark-stringify 序列化为 Markdown
3. 实现 `SpecKitRecognizer`
   - 识别用户故事模式
   - 识别优先级标记（P1/P2/P3）
   - 识别功能性需求（FR-001）
4. 编写往返测试
   - 测试用例：spec.md → AST → Nodes → AST → Markdown
   - 验证内容一致性（允许格式差异，但语义相同）
5. 集成到 flowgram.ai
   - 修改 App.tsx，添加"打开 Markdown 文件"功能
   - 使用 MarkdownAdapter 转换文件为节点
   - 加载到 flowgram.ai 画布

**验收标准**:
- [ ] 能够打开 spec.md 并转换为节点
- [ ] 节点层级关系正确（# → ## → ### → ####）
- [ ] spec-kit 元数据正确识别（用户故事编号、优先级）
- [ ] 往返测试通过（Markdown → Nodes → Markdown 一致）
- [ ] 单元测试覆盖率 > 90%

**输出**: 完整的 Markdown 适配层

---

### Phase 3: 卡片节点扩展（2 天）

**目标**: 扩展 flowgram.ai 的卡片节点，展示 spec-kit 元数据

**任务**:
1. 扩展 flowgram.ai 的 Node.tsx 组件
   - 添加优先级徽章渲染（P1/P2/P3）
   - 添加图标选择逻辑（根据节点类型）
   - 添加内容预览区域
   - 添加底栏元数据（状态、字数、修改时间）
2. 实现卡片样式
   - CSS 模块化样式
   - 优先级颜色（P1 红色、P2 橙色、P3 蓝色）
   - 悬停效果（高亮边框、显示 ✏️）
   - 选中状态（边框加粗）
3. 实现标题 inline 编辑
   - 悬停标题显示 ✏️ 图标
   - 单击进入 inline 编辑模式（使用轻量级 contentEditable 或 input）
   - Enter 保存（调用 Markdown Adapter 更新标题），Esc 取消
   - 与右侧面板编辑器同步（标题修改后自动更新编辑器内容）
4. 实现节点折叠/展开功能 ⭐
   - 添加折叠/展开按钮（左侧三角形图标 ▶/▼）
   - 点击后切换子节点的可见性（修改节点的 collapsed 状态）
   - 折叠时仅隐藏子节点，保留连线的起点
   - 保存折叠状态到布局配置（复用 flowgram.ai 的布局保存逻辑）
   - 支持键盘快捷键（Space 切换折叠/展开）
5. 测试卡片渲染
   - 不同类型节点的卡片样式
   - 优先级徽章显示
   - 元数据正确显示
   - 折叠/展开功能正常工作

**验收标准**:
- [ ] 卡片展示丰富信息（图标、优先级、预览、元数据）
- [ ] 优先级徽章醒目显示
- [ ] 标题 inline 编辑流畅（与右侧编辑器同步）
- [ ] 节点折叠/展开功能正常（折叠状态持久化保存）
- [ ] 卡片样式美观、一致

**输出**: 扩展后的卡片节点组件

---

### Phase 3.5: 节点增删管理（2 天）⭐ P2 功能

**目标**: 实现文档节点的增删改功能，支持在可视化界面中管理文档结构

**任务**:
1. 扩展 Markdown Adapter 支持节点 CRUD
   - `insertNode(parentId, type, title)`: 在 AST 中插入新标题节点
   - `deleteNode(nodeId)`: 从 AST 中删除节点及其子节点
   - `moveNode(nodeId, newParentId, newIndex)`: 移动节点位置（拖拽重排序）
   - `validateNodeOperation(operation)`: 验证操作合法性
2. 实现右键上下文菜单
   - 右键节点 → 显示菜单（新增子节点、删除节点、移动到...）
   - 右键画布 → 显示菜单（新增根节点、导入文件）
   - 菜单样式与 flowgram.ai 保持一致
3. 实现新增节点对话框
   - **字段**：节点类型（章节/用户故事/验收场景）、标题、优先级（可选）
   - **验证**：标题不为空、不与同级节点重复
   - **确认后**：调用 `insertNode` → 更新 AST → 重新生成 Markdown → 保存文件 → 刷新流程图
4. 实现删除节点功能
   - **检测子节点**：如果有子节点，显示警告"该节点有 N 个子节点，是否一并删除？"
   - **确认对话框**：两个选项（仅删除当前/级联删除）
   - **执行删除**：从 AST 中移除 → 重新生成 Markdown → 保存文件 → 刷新流程图
   - **不支持删除根节点**：显示错误提示
5. 实现节点拖拽重排序
   - **同级拖拽**：在同一父节点下调整顺序（更新 AST 中的节点顺序）
   - **跨层级拖拽**：移动到其他父节点下（更新父子关系）
   - **拖拽验证**：不允许父节点拖到子节点下（循环引用检测）
   - **视觉反馈**：拖拽时显示目标位置指示线
6. 测试节点管理功能
   - 新增节点 → 验证文件创建 → 验证流程图更新
   - 删除节点 → 验证文件删除 → 验证流程图更新
   - 拖拽重排序 → 验证 Markdown 文件中的节点顺序更新

**验收标准**:
- [ ] 能够右键新增子节点，自动创建 Markdown 标题
- [ ] 能够删除节点，Markdown 文件中的对应部分被移除
- [ ] 能够拖拽调整同级节点顺序，Markdown 文件顺序同步更新
- [ ] 能够拖拽移动节点到其他父节点下，层级关系正确
- [ ] 所有操作的合法性验证正常（不允许删除根节点、循环引用等）
- [ ] 新增/删除/移动操作后，Markdown 往返测试通过（无内容丢失）

**输出**: 完整的节点管理功能

**注意**: 此为 P2 功能，可根据 MVP 开发进度选择在 V1.0 实现或延后到后续版本

---

### Phase 4: TipTap 富文本编辑器集成（3 天）

**目标**: 集成 TipTap 到 flowgram.ai 的配置面板

**任务**:
1. 实现 RichTextEditor 组件
   - 初始化 TipTap 编辑器
   - 配置 Markdown 扩展（tiptap-markdown）
   - 实现富文本 ↔ Markdown 双向转换
2. 实现 EditorToolbar 组件
   - 所有格式化按钮（B、I、标题、列表等）
   - 按钮激活状态（当前选中是否加粗等）
   - 快捷键支持（Ctrl+B/I 等）
3. 扩展 flowgram.ai 的 PropertiesPanel
   - 检测 spec-kit 节点类型
   - 集成 RichTextEditor 替换原有编辑器
   - 保持与 flowgram.ai 的样式一致
4. 实现自动保存
   - 防抖 1 秒
   - 调用 Markdown Adapter 保存
5. 编写往返测试
   - Markdown → TipTap → Markdown
   - 验证格式化操作正确转换

**验收标准**:
- [ ] 点击卡片 → 右侧面板展开 → 显示 TipTap 编辑器
- [ ] 工具栏所有按钮正常工作
- [ ] 富文本 ↔ Markdown 双向转换无损
- [ ] 自动保存功能正常
- [ ] Ctrl+B/I 等快捷键生效

**输出**: 集成 TipTap 的配置面板

---

### Phase 5: Tauri 桌面化（2 天）

**目标**: 将 flowgram.ai Web 应用改造为 Tauri 桌面应用

**任务**:
1. 初始化 Tauri 配置
   - 在 flowgram.ai 项目中添加 `src-tauri/` 目录
   - 配置 `tauri.conf.json`
   - 配置 Cargo.toml（添加 notify 依赖）
2. 实现文件系统命令（Rust）
   - `read_markdown_file`
   - `write_markdown_file`
   - `select_markdown_file`
3. 实现文件监听服务（Rust）
   - `start_file_watcher`
   - 发送 `file-changed` 事件到前端
   - 附加文件元数据（修改时间、文件大小）
4. 前端集成 Tauri API
   - 替换文件读写逻辑
   - 监听 `file-changed` 事件
   - 重新加载文件并刷新节点
5. 避免编辑循环 ⭐
   - **内部修改标志位**：
     ```typescript
     let isInternalSave = false
     
     // 保存时设置标志
     async function saveFile(content: string) {
       isInternalSave = true
       await invoke('write_markdown_file', { path, content })
       setTimeout(() => { isInternalSave = false }, 1000) // 1秒后重置
     }
     
     // 文件监听回调中检查标志
     listen('file-changed', (event) => {
       if (isInternalSave) {
         console.log('Ignoring internal save')
         return
       }
       // 处理外部修改
       reloadFile()
     })
     ```
   - 内部修改不触发重新加载
6. 实现编辑冲突检测 ⭐
   - **检测冲突**：文件被外部修改 + 本地有未保存编辑
   - **冲突对话框**：
     - 显示"文件已被外部修改"警告
     - 选项 1："保留我的修改"（覆盖文件）
     - 选项 2："加载外部更改"（丢弃本地编辑）
     - 选项 3："并排查看"（显示 diff，手动合并）
   - **实现方式**：
     ```typescript
     // 跟踪本地编辑状态
     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
     const [lastSavedContent, setLastSavedContent] = useState('')
     
     // 文件监听回调
     listen('file-changed', async (event) => {
       if (isInternalSave) return
       
       if (hasUnsavedChanges) {
         // 显示冲突对话框
         showConflictDialog({
           onKeepLocal: () => saveFile(currentContent),
           onLoadExternal: () => reloadFile(),
           onShowDiff: () => openDiffViewer(lastSavedContent, externalContent)
         })
       } else {
         // 无冲突，直接重新加载
         reloadFile()
       }
     })
     ```
7. 实现 AI 生成状态检测 ⭐
   - **检测策略**：
     - 连续多次文件监听事件（间隔 < 500ms）
     - 文件大小持续增长
     - 判断为"AI 正在生成"
   - **UI 反馈**：
     - 对应节点显示脉冲动画（蓝色边框）
     - 图标旋转或添加"⚡生成中"徽章
     - 禁止编辑（锁定节点）
   - **实现方式**：
     ```typescript
     // 跟踪文件变化历史
     const fileChangeHistory = new Map<string, number[]>() // path -> [timestamp1, timestamp2, ...]
     
     listen('file-changed', (event) => {
       const { path, size } = event.payload
       const now = Date.now()
       const history = fileChangeHistory.get(path) || []
       history.push(now)
       
       // 保留最近 3 秒的历史
       const recentHistory = history.filter(t => now - t < 3000)
       fileChangeHistory.set(path, recentHistory)
       
       // 检测是否为 AI 生成（3 秒内 > 3 次变化）
       const isAIGenerating = recentHistory.length > 3
       
       if (isAIGenerating) {
         setNodeStatus(path, 'ai-generating')
       } else {
         setNodeStatus(path, 'completed')
       }
     })
     ```

**验收标准**:
- [ ] Tauri 应用能正常启动
- [ ] 能够选择和打开 Markdown 文件
- [ ] 文件读写功能正常
- [ ] 文件监听检测到外部修改（500ms 内响应）
- [ ] 无编辑循环问题（内部保存不触发重新加载）
- [ ] 编辑冲突检测正常（显示冲突对话框，三种解决方案可用）
- [ ] AI 生成状态检测正常（节点显示"生成中"动画，生成完成后恢复）

**输出**: Tauri 桌面应用

---

### Phase 6: 思维导图布局优化（1-2 天）

**目标**: 调整 flowgram.ai 的布局算法，优化为从左到右的思维导图布局

**任务**:
1. 分析 flowgram.ai 的布局算法
   - 当前布局方式（可能是网格或自由布局）
   - 布局配置参数
2. 实现思维导图布局算法
   - 根节点在左侧
   - 子节点向右延伸
   - 层级间距：300px（X 轴）
   - 同级间距：80px（Y 轴）
   - 使用平滑曲线连接
3. 集成到 flowgram.ai Layout Engine
   - 添加布局模式切换（网格/思维导图）
   - 默认使用思维导图布局
4. 测试布局效果
   - 小型文档（10 个节点）
   - 中型文档（50 个节点）
   - 大型文档（200 个节点）

**验收标准**:
- [ ] 节点从左到右排列
- [ ] 层级关系清晰
- [ ] 无节点重叠
- [ ] 连线美观（平滑曲线）

**输出**: 思维导图布局算法

---

### Phase 7: 性能优化和虚拟化（1-2 天）

**目标**: 支持大型文档（500+ 节点）不卡顿

**任务**:
1. 实现虚拟化渲染
   - 仅渲染可见区域的节点
   - 滚动时动态加载
2. 优化 Markdown 解析性能
   - 缓存解析结果
   - 增量更新（仅重新解析变化的部分）
3. 优化 TipTap 编辑器
   - 懒加载（仅在打开配置面板时初始化）
   - 销毁编辑器（关闭面板时）
4. React 性能优化
   - 使用 React.memo 避免不必要的重渲染
   - 使用 useCallback 缓存事件处理器
5. 性能测试
   - 加载 1000 行 spec.md
   - 渲染 500 个节点
   - 拖拽帧率测试

**验收标准**:
- [ ] 解析 1000 行 spec.md < 100ms
- [ ] 渲染 100+ 节点 < 2s
- [ ] 拖拽帧率 60fps
- [ ] 500+ 节点无卡顿

**输出**: 性能优化的应用

---

### Phase 8: 测试和文档（2-3 天）

**目标**: 确保质量和可维护性

**任务**:
1. 单元测试
   - Markdown Adapter（往返测试）
   - SpecKit Recognizer（模式识别）
   - 覆盖率 > 80%
2. 组件测试
   - 卡片节点渲染
   - 富文本编辑器
   - 配置面板交互
3. E2E 测试（Playwright）
   - 打开文件 → 显示思维导图
   - 点击节点 → 编辑内容 → 保存
   - 外部修改 → 自动刷新
4. 用户文档
   - README.md（快速开始）
   - docs/user-guide.md（完整用户指南）
   - docs/development.md（开发者文档）
5. 技术文档
   - docs/architecture.md（架构说明）
   - docs/flowgram-integration.md（flowgram.ai 集成说明）
   - docs/markdown-adapter.md（Markdown 适配器文档）

**验收标准**:
- [ ] 所有测试通过
- [ ] 测试覆盖率 > 80%
- [ ] 用户文档完整
- [ ] 技术文档清晰

**输出**: 生产就绪的应用

---

## 技术决策

### 决策 1: 基于 flowgram.ai 改造 vs 从零实现

**选择**: ✅ 基于 flowgram.ai 改造

**理由**:
- flowgram.ai 已经实现了卡片节点渲染、拖拽、布局等复杂功能
- 从零实现这些功能需要 20+ 天，且容易出现性能问题
- 改造方式可以在 10-15 天内完成，并保证质量

**风险**: flowgram.ai 的架构可能不完全适合我们的需求

**缓解**: 深入研究 flowgram.ai 源码，确保兼容性；必要时提交 PR 贡献回上游项目

---

### 决策 2: TipTap vs Lexical vs CodeMirror

**选择**: ✅ TipTap

**理由**:
- 原生 Markdown 支持（tiptap-markdown）
- 所见即所得，面向非技术人员
- React 集成完善
- 包体积适中（~50KB）

**替代方案**: Lexical（Markdown 支持不如 TipTap）、CodeMirror（需要了解 Markdown 语法）

---

### 决策 3: Tauri vs Electron

**选择**: ✅ Tauri

**理由**:
- 打包体积小（< 10MB vs Electron ~100MB）
- 性能好（使用系统 WebView）
- Rust 文件监听更可靠（notify crate）
- 符合 constitution 的轻量级要求

---

### 决策 4: 思维导图布局 vs 网格布局

**选择**: ✅ 思维导图布局（从左到右）

**理由**:
- 更符合文档层级关系的展示
- 用户更容易理解结构
- 与传统思维导图工具的习惯一致

**实现**: 可能需要调整 flowgram.ai 的默认布局算法

---

## 时间线估算

**总计**: 12-18 工作日（包含 P2 功能）

| Phase | 内容 | 时间 | 依赖 | 优先级 |
|-------|------|------|------|--------|
| Phase 1 | 项目准备和 flowgram.ai 集成 | 2-3 天 | - | P1 |
| Phase 2 | Markdown 适配层 | 3-4 天 | Phase 1 | P1 |
| Phase 3 | 卡片节点扩展 | 2 天 | Phase 2 | P1 |
| Phase 3.5 | 节点增删管理 | 2 天 | Phase 2, 3 | **P2** ⚠️ 可选 |
| Phase 4 | TipTap 集成 | 3 天 | Phase 2, 3 | P1 |
| Phase 5 | Tauri 桌面化 | 2-3 天 | Phase 1 | P1/P2 |
| Phase 6 | 思维导图布局 | 1-2 天 | Phase 2, 3 | P1 |
| Phase 7 | 性能优化 | 1-2 天 | Phase 2-6 | P1 |
| Phase 8 | 测试和文档 | 2-3 天 | Phase 2-7 | P1 |

**MVP 关键路径**（仅 P1 功能）: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 6 → Phase 7 → Phase 8  
**预计时间**: 10-15 工作日

**完整 V1.0 路径**（P1 + P2）: 在 MVP 基础上增加 Phase 3.5 和 Phase 5 的完整功能  
**预计时间**: 12-18 工作日

**并行可能**: 
- Phase 5（Tauri）和 Phase 6（布局）可以与 Phase 4（TipTap）并行
- Phase 3.5（节点管理）可以与 Phase 4（TipTap）并行（如果团队资源充足）

---

## 风险和缓解策略

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| **flowgram.ai 架构不兼容** | 高 | 低 | Phase 1 深入研究源码，早期发现问题 |
| **Markdown 双向转换丢失信息** | 高 | 中 | 编写全面的往返测试，保留 AST 引用 |
| **TipTap 与 flowgram.ai 样式冲突** | 中 | 中 | 使用 CSS Modules 隔离样式 |
| **性能不满足要求** | 高 | 低 | Phase 7 专门优化，使用虚拟化渲染 |
| **文件监听循环触发** | 中 | 中 | 使用标志位区分内部/外部修改 |

---

## 测试策略

### 单元测试
- **Markdown Adapter**: 往返测试（覆盖率 > 90%）
- **SpecKit Recognizer**: 模式识别测试
- **工具函数**: 覆盖率 > 85%

### 组件测试
- **卡片节点**: 渲染和交互测试
- **富文本编辑器**: 格式化操作测试
- **配置面板**: 打开/关闭/保存测试

### 集成测试
- **完整流程**: 打开文件 → 显示 → 编辑 → 保存 → 验证文件
- **文件监听**: 外部修改 → 自动刷新

### E2E 测试
- **用户旅程**: 
  1. 打开应用 → 选择 spec.md
  2. 查看思维导图
  3. 点击节点 → 编辑内容
  4. 保存 → 验证文件更新
- **性能测试**: 大型文档加载和渲染

---

## 部署策略

### 开发环境
```bash
cd flowgram.ai-fork
npm install
npm run dev      # 启动 Web 开发服务器（Phase 1-4）
npm run tauri dev # 启动 Tauri 桌面应用（Phase 5+）
```

### 构建
```bash
npm run build          # 构建前端资源
npm run tauri build    # 打包 Tauri 应用
```

### 产物
- **macOS**: `.dmg`, `.app`
- **Windows**: `.msi`, `.exe`
- **Linux**: `.deb`, `.appimage`

---

## 成功标准

### MVP 交付标准（P1 功能）
- [ ] 能够打开 spec.md 并显示为思维导图（从左到右布局）
- [ ] 卡片节点展示丰富信息（图标、优先级、预览、元数据）
- [ ] 节点折叠/展开功能正常（聚焦关键信息）
- [ ] 点击卡片 → 右侧面板展开 → TipTap 编辑器
- [ ] 标题 inline 编辑流畅（悬停显示 ✏️，单击即可编辑）
- [ ] 富文本编辑 → 自动保存为 Markdown（1 秒防抖）
- [ ] 文件监听正常（外部修改 500ms 内同步）
- [ ] 编辑冲突检测正常（显示冲突对话框）
- [ ] 往返测试通过（Markdown → Nodes → Markdown 一致）
- [ ] 性能要求达标（解析 < 100ms，渲染 < 2s，60fps）

### V1.0 交付标准（P1 + P2）
- [ ] P1 功能稳定可用（MVP 所有功能）
- [ ] P2 功能实现：
  - [ ] 节点增删管理（右键新增、删除、拖拽重排序）
  - [ ] AI 执行状态实时同步（检测"生成中"状态，显示脉冲动画）
- [ ] 所有测试通过（覆盖率 > 80%）
- [ ] 用户文档完整
- [ ] 跨平台打包成功（macOS/Windows/Linux）

### V2.0 未来规划（P3 功能）
- [ ] AI 校验集成（手动触发，显示校验结果）
- [ ] CLI 工具集成框架（命令面板，实时日志）
- [ ] 更多高级功能...

---

## 参考资料

### flowgram.ai 项目
- **GitHub**: https://github.com/bytedance/flowgram.ai/tree/main/apps/demo-free-layout
- **在线 Demo**: （如果有）
- **文档**: 研究其 README 和源码注释

### 技术文档
- **unified**: https://unifiedjs.com/
- **remark**: https://github.com/remarkjs/remark
- **TipTap**: https://tiptap.dev/
- **Tauri**: https://tauri.app/v1/guides/

---

## P2/P3 功能实施策略

### P2 功能实施建议

本计划已完整包含 P2 功能的设计和实施细节：

#### Phase 3.5: 节点增删管理（2 天）
- **功能**: 右键新增子节点、删除节点、拖拽重排序
- **实施时机**: 
  - **方案 A（推荐）**: 在 MVP（P1 功能）稳定后作为第一个增强功能实施
  - **方案 B**: 与 P1 功能并行开发（如果资源充足）
- **理由**: 虽然重要，但用户可以先通过外部编辑器管理文档结构，系统会自动检测更新

#### Phase 5: AI 执行状态实时同步
- **功能**: 检测 AI 正在生成文件，显示"生成中"状态和脉冲动画
- **已包含**: Phase 5 任务 7 中已详细设计
- **实施时机**: 与 P1 的文件监听功能一起实现（同属 Phase 5）
- **理由**: 文件监听是 P1 核心功能，AI 状态检测是其自然扩展

### P3 功能预留

P3 功能（AI 校验、CLI 工具集成）暂不包含在本计划中，原因：
1. **AI 校验**（用户故事 5）: 用户可以通过 `/speckit.analyze` 命令手动校验
2. **CLI 工具集成**（用户故事 6）: 用户可以在终端或 IDE 中执行 spec-kit 命令

**技术预留**:
- Markdown Adapter 已支持双向转换，为 CLI 集成打下基础
- 文件监听机制可以检测 CLI 工具执行结果
- 富文本编辑器可以嵌入 AI 校验结果显示

**未来实施**:
- V2.0 或后续迭代根据用户反馈决定是否实施
- 预计额外时间：3-5 工作日（AI 校验 2 天 + CLI 集成 2-3 天）

### 实施路径建议

**阶段 1: MVP（P1 功能）** - 10-15 工作日
- Phase 1 → 2 → 3 → 4 → 6 → 7 → 8
- 交付：可视化 + 编辑 + 文件同步 + 折叠展开
- 目标：核心工作流可用，用户可以开始使用

**阶段 2: V1.0（P1 + P2）** - 额外 2-3 工作日
- Phase 3.5（节点管理）
- Phase 5 中的 AI 状态检测（可能已包含在 MVP 中）
- 交付：完整的文档管理体验
- 目标：用户无需离开应用即可完成所有文档操作

**阶段 3: V2.0（P1 + P2 + P3）** - 根据反馈决定
- AI 校验集成
- CLI 工具集成框架
- 交付：与 spec-kit 生态深度集成
- 目标：一站式 SDD 工作台

---

**计划版本**: v1.1（补充 P2/P3 实施策略）  
**基于**: spec.md v2.0（已确认）  
**最后更新**: 2025-10-31  
**变更摘要**: 
- 新增 Phase 3.5（节点增删管理，P2 功能）
- 补充 Phase 3（节点折叠/展开功能，标题 inline 编辑细节）
- 补充 Phase 5（编辑冲突检测、AI 生成状态检测的完整实现）
- 更新时间线估算（MVP 10-15 天，V1.0 12-18 天）
- 更新成功标准（细化 MVP 和 V1.0 交付标准）
- 新增 P2/P3 功能实施策略说明

**状态**: ✅ 已修正完成，等待用户确认（STEP 4）

