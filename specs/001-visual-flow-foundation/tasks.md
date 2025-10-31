# Visual Flow Foundation - Task Breakdown

本文档将实施计划分解为具体的、可执行的任务，按照用户故事和依赖关系组织。

---

## Phase 1: 项目初始化和基础设施

### Prerequisites
- [x] Constitution 已创建
- [x] Specification 已创建
- [x] Implementation Plan 已创建
- [ ] Node.js 18+ 已安装
- [ ] Rust 1.70+ 已安装
- [ ] 开发环境配置完成

### Task 1.1: 初始化 Tauri 项目
**Type**: Configuration  
**Files**: 
- `package.json`
- `src-tauri/Cargo.toml`
- `src-tauri/tauri.conf.json`

**Description**: 使用 `npm create tauri-app` 初始化项目，选择 React + TypeScript 模板

**Dependencies**: None

**Steps**:
```bash
npm create tauri-app -- --name spec-kit-flow --template react-ts
cd spec-kit-flow
```

**Validation**:
- [ ] 项目目录创建成功
- [ ] `package.json` 包含 Tauri 依赖
- [ ] `src-tauri/` 目录存在

---

### Task 1.2: 配置 TypeScript 严格模式
**Type**: Configuration  
**Files**: 
- `tsconfig.json`
- `tsconfig.node.json`

**Description**: 启用 TypeScript 严格模式，配置路径别名

**Dependencies**: Task 1.1

**Steps**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@services/*": ["./src/services/*"],
      "@stores/*": ["./src/stores/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

**Validation**:
- [ ] `tsc --noEmit` 无错误
- [ ] 路径别名在 IDE 中正常解析

---

### Task 1.3: 设置 Vite 配置
**Type**: Configuration  
**Files**: 
- `vite.config.ts`

**Description**: 配置 Vite，添加路径别名、环境变量

**Dependencies**: Task 1.2

**Code**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true
  }
})
```

**Validation**:
- [ ] `npm run dev` 启动成功
- [ ] 热重载正常工作

---

### Task 1.4: 安装核心依赖
**Type**: Configuration  
**Files**: 
- `package.json`

**Description**: 安装 ReactFlow, Zustand, CodeMirror 等核心依赖

**Dependencies**: Task 1.1

**Steps**:
```bash
npm install reactflow zustand @uiw/react-codemirror react-markdown remark-gfm
npm install -D @types/react @types/react-dom vitest @testing-library/react @testing-library/user-event jsdom
```

**Validation**:
- [ ] 所有依赖安装成功
- [ ] `npm run build` 构建成功

---

### Task 1.5: 配置 ESLint + Prettier
**Type**: Configuration  
**Files**: 
- `.eslintrc.cjs`
- `.prettierrc`
- `.prettierignore`

**Description**: 配置代码规范工具

**Dependencies**: Task 1.1

**Parallel Marker**: [P]

**Validation**:
- [ ] `npm run lint` 运行成功
- [ ] `npm run format` 格式化代码

---

### Task 1.6: 设置测试环境
**Type**: Configuration  
**Files**: 
- `vitest.config.ts`
- `src/test/setup.ts`

**Description**: 配置 Vitest 和 React Testing Library

**Dependencies**: Task 1.4

**Parallel Marker**: [P]

**Code**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'src/test/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

**Validation**:
- [ ] `npm run test` 运行成功
- [ ] 示例测试通过

---

### Task 1.7: 创建基础目录结构
**Type**: Implementation  
**Files**: 
- `src/components/`
- `src/services/`
- `src/stores/`
- `src/types/`
- `src/utils/`
- `src/hooks/`

**Description**: 创建项目目录结构

**Dependencies**: Task 1.1

**Steps**:
```bash
mkdir -p src/components/{FlowCanvas,NodeEditor,ToolBar,common}
mkdir -p src/services
mkdir -p src/stores
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p src/test
```

**Validation**:
- [ ] 所有目录创建成功

---

### Task 1.8: 实现基础 Tauri 命令
**Type**: Implementation  
**Files**: 
- `src-tauri/src/main.rs`
- `src-tauri/src/commands.rs`

**Description**: 创建打开目录选择对话框的 Tauri 命令

**Dependencies**: Task 1.1

**Code**:
```rust
// src-tauri/src/commands.rs
use tauri::api::dialog::blocking::FileDialogBuilder;

#[tauri::command]
pub fn select_directory() -> Option<String> {
    FileDialogBuilder::new()
        .set_title("Select Spec-Kit Project Directory")
        .pick_folder()
        .and_then(|path| path.to_str().map(|s| s.to_string()))
}
```

**Validation**:
- [ ] 对话框能正常打开
- [ ] 选择目录后返回正确路径

---

### Checkpoint - Phase 1
- [ ] `npm run dev` 启动开发服务器成功
- [ ] Tauri 窗口打开并显示 React 应用
- [ ] TypeScript 无错误
- [ ] 测试环境正常运行
- [ ] 目录选择对话框功能正常

---

## Phase 2: 文件系统服务

### Task 2.1: 定义文件系统 Tauri 命令接口
**Type**: Implementation  
**Files**: 
- `src-tauri/src/fs_commands.rs`

**Description**: 实现 Rust 端的文件系统操作命令

**Dependencies**: Phase 1 Checkpoint

**Code**:
```rust
use std::fs;
use std::path::Path;
use tauri::command;

#[command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| e.to_string())
}

#[command]
pub fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| e.to_string())
}

#[command]
pub fn delete_file(path: String) -> Result<(), String> {
    // Move to trash instead of permanent delete
    trash::delete(&path)
        .map_err(|e| e.to_string())
}

#[command]
pub fn create_directory(path: String) -> Result<(), String> {
    fs::create_dir_all(&path)
        .map_err(|e| e.to_string())
}

#[command]
pub fn list_directory(path: String) -> Result<Vec<String>, String> {
    fs::read_dir(&path)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            entry.ok().and_then(|e| {
                e.path().to_str().map(|s| s.to_string())
            })
        })
        .collect::<Vec<_>>()
        .into()
}
```

**Validation**:
- [ ] 所有命令编译通过
- [ ] 添加到 Tauri 主函数的 invoke_handler

---

### Task 2.2: 实现文件监听服务 (Rust)
**Type**: Implementation  
**Files**: 
- `src-tauri/src/watcher.rs`
- `src-tauri/Cargo.toml` (add notify dependency)

**Description**: 使用 notify crate 监听文件系统变化

**Dependencies**: Task 2.1

**Code**:
```rust
use notify::{Watcher, RecursiveMode, Result as NotifyResult};
use tauri::{AppHandle, Manager};
use std::sync::mpsc::channel;
use std::time::Duration;

pub fn start_watcher(app_handle: AppHandle, path: String) -> NotifyResult<()> {
    let (tx, rx) = channel();
    
    let mut watcher = notify::recommended_watcher(move |res| {
        tx.send(res).unwrap();
    })?;
    
    watcher.watch(Path::new(&path), RecursiveMode::Recursive)?;
    
    std::thread::spawn(move || {
        loop {
            match rx.recv() {
                Ok(Ok(event)) => {
                    app_handle.emit_all("file-changed", event).unwrap();
                }
                _ => {}
            }
        }
    });
    
    Ok(())
}
```

**Validation**:
- [ ] 文件修改能触发事件
- [ ] 事件发送到前端

---

### Task 2.3: 创建前端文件系统服务
**Type**: Implementation  
**Files**: 
- `src/services/fileSystem.ts`
- `src/types/fileSystem.ts`

**Description**: TypeScript 包装器，调用 Tauri 命令

**Dependencies**: Task 2.1

**Code**:
```typescript
import { invoke } from '@tauri-apps/api/tauri'

export interface FileSystemService {
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  deleteFile(path: string): Promise<void>
  createDirectory(path: string): Promise<void>
  listDirectory(path: string): Promise<string[]>
  selectDirectory(): Promise<string | null>
}

export const fileSystemService: FileSystemService = {
  async readFile(path: string): Promise<string> {
    return invoke('read_file', { path })
  },
  
  async writeFile(path: string, content: string): Promise<void> {
    return invoke('write_file', { path, content })
  },
  
  async deleteFile(path: string): Promise<void> {
    return invoke('delete_file', { path })
  },
  
  async createDirectory(path: string): Promise<void> {
    return invoke('create_directory', { path })
  },
  
  async listDirectory(path: string): Promise<string[]> {
    return invoke('list_directory', { path })
  },
  
  async selectDirectory(): Promise<string | null> {
    return invoke('select_directory')
  }
}
```

**Validation**:
- [ ] 所有方法类型正确
- [ ] 能成功调用 Tauri 命令

---

### Task 2.4: 创建文件监听服务 (前端)
**Type**: Implementation  
**Files**: 
- `src/services/fileWatcher.ts`

**Description**: 监听 Tauri 事件并通知应用

**Dependencies**: Task 2.2, Task 2.3

**Code**:
```typescript
import { listen, UnlistenFn } from '@tauri-apps/api/event'

export type FileChangeEvent = {
  type: 'created' | 'modified' | 'deleted'
  path: string
}

export type FileChangeCallback = (event: FileChangeEvent) => void

export class FileWatcherService {
  private unlisten?: UnlistenFn
  
  async start(callback: FileChangeCallback): Promise<void> {
    this.unlisten = await listen('file-changed', (event) => {
      callback(event.payload as FileChangeEvent)
    })
  }
  
  stop(): void {
    this.unlisten?.()
  }
}

export const fileWatcherService = new FileWatcherService()
```

**Validation**:
- [ ] 文件变化触发回调
- [ ] 能正确停止监听

---

### Task 2.5: 编写文件系统服务测试
**Type**: Test  
**Files**: 
- `src/services/__tests__/fileSystem.test.ts`

**Description**: 单元测试文件系统服务

**Dependencies**: Task 2.3

**Code**:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { fileSystemService } from '../fileSystem'

vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn()
}))

describe('FileSystemService', () => {
  it('should read file', async () => {
    const { invoke } = await import('@tauri-apps/api/tauri')
    vi.mocked(invoke).mockResolvedValue('file content')
    
    const content = await fileSystemService.readFile('/path/to/file')
    
    expect(invoke).toHaveBeenCalledWith('read_file', { path: '/path/to/file' })
    expect(content).toBe('file content')
  })
  
  // ... more tests
})
```

**Validation**:
- [ ] 测试覆盖率 > 80%
- [ ] 所有测试通过

---

### Checkpoint - Phase 2
- [ ] 能够选择项目目录
- [ ] 能够读取 .md 文件内容
- [ ] 能够写入文件
- [ ] 文件修改能触发监听事件
- [ ] 所有文件系统测试通过

---

## Phase 3: Spec-Kit 项目扫描

### Task 3.1: 定义 SpecKit 类型
**Type**: Implementation  
**Files**: 
- `src/types/speckit.ts`

**Description**: 定义所有 SpecKit 相关的 TypeScript 类型

**Dependencies**: Phase 2 Checkpoint

**Code**:
```typescript
export type NodeType = 'constitution' | 'spec' | 'plan' | 'task'

export interface SpecKitNode {
  id: string
  type: NodeType
  title: string
  filePath: string
  parentId?: string
  position: { x: number; y: number }
  metadata: {
    lastModified: number
    status?: 'draft' | 'in-progress' | 'completed'
    size?: number
  }
}

export interface SpecKitProject {
  rootPath: string
  constitution?: SpecKitNode
  specs: SpecKitNode[]
  layoutVersion: string
}

export interface LayoutData {
  version: string
  nodes: Record<string, { x: number; y: number }>
  viewport: { x: number; y: number; zoom: number }
}
```

**Validation**:
- [ ] TypeScript 编译无错误
- [ ] 类型定义完整

---

### Task 3.2: 实现 SpecKitScanner 类
**Type**: Implementation  
**Files**: 
- `src/services/specKitScanner.ts`

**Description**: 扫描项目目录，生成节点数据

**Dependencies**: Task 3.1

**Code**:
```typescript
import { fileSystemService } from './fileSystem'
import { SpecKitNode, SpecKitProject, NodeType } from '@types/speckit'
import path from 'path-browserify'

export class SpecKitScanner {
  async scanProject(rootPath: string): Promise<SpecKitProject> {
    const project: SpecKitProject = {
      rootPath,
      specs: [],
      layoutVersion: '1.0'
    }
    
    // Scan constitution
    const constitutionPath = path.join(rootPath, 'memory/constitution.md')
    try {
      const content = await fileSystemService.readFile(constitutionPath)
      project.constitution = this.createNode(
        'constitution',
        constitutionPath,
        content
      )
    } catch (e) {
      console.warn('Constitution not found')
    }
    
    // Scan specs
    const specsDir = path.join(rootPath, 'specs')
    const specDirs = await fileSystemService.listDirectory(specsDir)
    
    for (const specDir of specDirs) {
      const specNode = await this.scanSpec(specDir)
      if (specNode) {
        project.specs.push(specNode)
      }
    }
    
    return project
  }
  
  private async scanSpec(specDir: string): Promise<SpecKitNode | null> {
    const specPath = path.join(specDir, 'spec.md')
    try {
      const content = await fileSystemService.readFile(specPath)
      return this.createNode('spec', specPath, content)
    } catch (e) {
      return null
    }
  }
  
  private createNode(
    type: NodeType,
    filePath: string,
    content: string
  ): SpecKitNode {
    const title = this.extractTitle(content)
    const id = this.generateId(filePath)
    
    return {
      id,
      type,
      title,
      filePath,
      position: { x: 0, y: 0 }, // Will be set by layout
      metadata: {
        lastModified: Date.now(),
        size: content.length
      }
    }
  }
  
  private extractTitle(content: string): string {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1] : 'Untitled'
  }
  
  private generateId(filePath: string): string {
    return btoa(filePath).replace(/[^a-zA-Z0-9]/g, '')
  }
}

export const specKitScanner = new SpecKitScanner()
```

**Validation**:
- [ ] 能扫描当前项目
- [ ] 正确识别 constitution
- [ ] 正确识别所有 specs

---

### Task 3.3: 实现默认布局算法
**Type**: Implementation  
**Files**: 
- `src/services/layoutAlgorithm.ts`

**Description**: 简单的树形布局算法

**Dependencies**: Task 3.2

**Code**:
```typescript
import { SpecKitNode } from '@types/speckit'

export function applyTreeLayout(nodes: SpecKitNode[]): SpecKitNode[] {
  const ROOT_X = 400
  const ROOT_Y = 100
  const LEVEL_GAP = 200
  const NODE_GAP = 150
  
  const constitution = nodes.find(n => n.type === 'constitution')
  const specs = nodes.filter(n => n.type === 'spec')
  
  if (constitution) {
    constitution.position = { x: ROOT_X, y: ROOT_Y }
  }
  
  specs.forEach((spec, index) => {
    spec.position = {
      x: ROOT_X + (index - specs.length / 2) * NODE_GAP,
      y: ROOT_Y + LEVEL_GAP
    }
    
    if (constitution) {
      spec.parentId = constitution.id
    }
  })
  
  return nodes
}
```

**Validation**:
- [ ] 布局不重叠
- [ ] 层级关系清晰

---

### Task 3.4: 编写 Scanner 测试
**Type**: Test  
**Files**: 
- `src/services/__tests__/specKitScanner.test.ts`
- `src/test/fixtures/sample-project/` (测试数据)

**Description**: 单元测试项目扫描功能

**Dependencies**: Task 3.2

**Validation**:
- [ ] 测试覆盖率 > 80%
- [ ] 所有测试通过

---

### Checkpoint - Phase 3
- [ ] 能够扫描 spec-kit-flow 项目
- [ ] 正确生成节点数据
- [ ] 节点层级关系正确
- [ ] 默认布局生成正确
- [ ] 测试通过

---

## Phase 4: 流程图画布

### Task 4.1: 创建 FlowCanvas 组件
**Type**: Implementation  
**Files**: 
- `src/components/FlowCanvas/FlowCanvas.tsx`
- `src/components/FlowCanvas/FlowCanvas.module.css`

**Description**: 主流程图画布组件

**Dependencies**: Phase 3 Checkpoint

**Code**:
```typescript
import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useFlowStore } from '@stores/flowStore'
import CustomNode from './CustomNode'
import './FlowCanvas.module.css'

const nodeTypes = {
  custom: CustomNode
}

export default function FlowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore()
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}
```

**Validation**:
- [ ] 画布正常渲染
- [ ] 缩放和平移工作正常

---

### Task 4.2: 创建自定义节点组件
**Type**: Implementation  
**Files**: 
- `src/components/FlowCanvas/CustomNode.tsx`
- `src/components/FlowCanvas/CustomNode.module.css`

**Description**: 自定义节点样式和交互

**Dependencies**: Task 4.1

**Code**:
```typescript
import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { SpecKitNode } from '@types/speckit'
import styles from './CustomNode.module.css'

const NODE_ICONS = {
  constitution: '👑',
  spec: '📄',
  plan: '📋',
  task: '✅'
}

export default memo(function CustomNode({ data }: NodeProps<SpecKitNode>) {
  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Top} />
      
      <div className={styles.header}>
        <span className={styles.icon}>{NODE_ICONS[data.type]}</span>
        <span className={styles.type}>{data.type}</span>
      </div>
      
      <div className={styles.title}>{data.title}</div>
      
      {data.metadata.status && (
        <div className={styles.status}>{data.metadata.status}</div>
      )}
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
})
```

**Validation**:
- [ ] 节点正确显示图标和标题
- [ ] 节点样式美观

---

### Task 4.3: 实现节点拖拽
**Type**: Implementation  
**Files**: 
- `src/stores/flowStore.ts`

**Description**: 处理节点拖拽逻辑

**Dependencies**: Task 4.2

**Code**:
```typescript
import { create } from 'zustand'
import { Node, Edge, OnNodesChange, OnEdgesChange, OnConnect, applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow'

interface FlowStore {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    })
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    })
  },
  
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges)
    })
  }
}))
```

**Validation**:
- [ ] 拖拽流畅（60 FPS）
- [ ] 连接线实时更新

---

### Task 4.4: 实现上下文菜单
**Type**: Implementation  
**Files**: 
- `src/components/FlowCanvas/ContextMenu.tsx`
- `src/hooks/useContextMenu.ts`

**Description**: 右键菜单功能

**Dependencies**: Task 4.1

**Code**:
```typescript
// useContextMenu.ts
import { useState, useCallback, MouseEvent } from 'react'

export function useContextMenu() {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
  
  const handleContextMenu = useCallback((event: MouseEvent) => {
    event.preventDefault()
    setMenuPosition({ x: event.clientX, y: event.clientY })
  }, [])
  
  const closeMenu = useCallback(() => {
    setMenuPosition(null)
  }, [])
  
  return { menuPosition, handleContextMenu, closeMenu }
}
```

**Validation**:
- [ ] 右键显示菜单
- [ ] 菜单选项正确

---

### Checkpoint - Phase 4
- [ ] 流程图正确显示所有节点
- [ ] 节点拖拽流畅
- [ ] 缩放和平移正常
- [ ] 上下文菜单功能正常

---

## Phase 5: 节点编辑器

### Task 5.1: 创建 NodeEditor 组件
**Type**: Implementation  
**Files**: 
- `src/components/NodeEditor/NodeEditor.tsx`
- `src/components/NodeEditor/NodeEditor.module.css`

**Description**: 侧边栏编辑器面板

**Dependencies**: Phase 4 Checkpoint

**Code**:
```typescript
import { useEditorStore } from '@stores/editorStore'
import { CodeEditor } from './CodeEditor'
import { MarkdownPreview } from './MarkdownPreview'
import styles from './NodeEditor.module.css'

export default function NodeEditor() {
  const { currentNode, content, isPreview, setContent, closeEditor } = useEditorStore()
  
  if (!currentNode) return null
  
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>{currentNode.title}</h3>
        <button onClick={closeEditor}>✕</button>
      </div>
      
      <div className={styles.metadata}>
        <span>{currentNode.filePath}</span>
        <span>Last modified: {new Date(currentNode.metadata.lastModified).toLocaleString()}</span>
      </div>
      
      <div className={styles.content}>
        {isPreview ? (
          <MarkdownPreview content={content} />
        ) : (
          <CodeEditor
            value={content}
            onChange={setContent}
          />
        )}
      </div>
    </div>
  )
}
```

**Validation**:
- [ ] 双击节点打开编辑器
- [ ] 编辑器显示正确内容

---

### Task 5.2: 集成 CodeMirror 编辑器
**Type**: Implementation  
**Files**: 
- `src/components/NodeEditor/CodeEditor.tsx`

**Description**: Markdown 代码编辑器

**Dependencies**: Task 5.1

**Code**:
```typescript
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      extensions={[markdown()]}
      theme={oneDark}
      onChange={onChange}
    />
  )
}
```

**Validation**:
- [ ] 语法高亮正常
- [ ] 编辑流畅

---

### Task 5.3: 实现 Markdown 预览
**Type**: Implementation  
**Files**: 
- `src/components/NodeEditor/MarkdownPreview.tsx`

**Description**: Markdown 渲染预览

**Dependencies**: Task 5.1

**Code**:
```typescript
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './MarkdownPreview.module.css'

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className={styles.preview}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

**Validation**:
- [ ] Markdown 渲染正确
- [ ] 支持表格、代码块等

---

### Task 5.4: 实现编辑工具栏
**Type**: Implementation  
**Files**: 
- `src/components/NodeEditor/EditorToolbar.tsx`

**Description**: 保存、预览切换等功能

**Dependencies**: Task 5.1

**Validation**:
- [ ] 保存按钮工作正常
- [ ] 预览切换正常

---

### Task 5.5: 实现自动保存
**Type**: Implementation  
**Files**: 
- `src/stores/editorStore.ts`
- `src/hooks/useAutoSave.ts`

**Description**: 防抖自动保存

**Dependencies**: Task 5.2

**Code**:
```typescript
import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { fileSystemService } from '@services/fileSystem'

export function useAutoSave(filePath: string, content: string) {
  const debouncedSave = useDebouncedCallback(
    async (path: string, data: string) => {
      await fileSystemService.writeFile(path, data)
    },
    1000
  )
  
  useEffect(() => {
    debouncedSave(filePath, content)
  }, [content, filePath, debouncedSave])
}
```

**Validation**:
- [ ] 编辑后 1 秒自动保存
- [ ] 文件内容正确更新

---

### Checkpoint - Phase 5
- [ ] 双击节点打开编辑器
- [ ] 编辑器显示正确内容
- [ ] Markdown 语法高亮正常
- [ ] 预览渲染正确
- [ ] 自动保存工作正常

---

## Phase 6: CRUD 操作

### Task 6.1: 实现创建文档功能
**Type**: Implementation  
**Files**: 
- `src/services/docCreator.ts`

**Description**: 从模板创建新文档

**Dependencies**: Phase 5 Checkpoint

**Validation**:
- [ ] 能创建新 spec
- [ ] 从模板复制内容
- [ ] 流程图自动添加节点

---

### Task 6.2: 实现删除文档功能
**Type**: Implementation  
**Files**: 
- `src/components/common/ConfirmDialog.tsx`
- `src/services/docDeleter.ts`

**Description**: 删除文档并移到回收站

**Dependencies**: Phase 5 Checkpoint

**Validation**:
- [ ] 显示确认对话框
- [ ] 文件移到回收站
- [ ] 节点从流程图移除

---

### Task 6.3: 实现撤销/重做
**Type**: Implementation  
**Files**: 
- `src/stores/historyMiddleware.ts`

**Description**: 使用 Zustand 历史中间件

**Dependencies**: Task 6.1, Task 6.2

**Validation**:
- [ ] Ctrl+Z 撤销
- [ ] Ctrl+Shift+Z 重做

---

### Checkpoint - Phase 6
- [ ] 能创建、编辑、删除文档
- [ ] 撤销/重做正常工作

---

## Phase 7-10: 剩余阶段

*(为了简洁，后续阶段的任务将在实施过程中继续细化)*

### Task 7.x: 布局持久化
### Task 8.x: 文件系统同步
### Task 9.x: UI 优化和无障碍
### Task 10.x: 测试和文档

---

## Implementation Order Summary

1. ✅ **Phase 1** (1-2 days): 项目初始化
2. ✅ **Phase 2** (2-3 days): 文件系统服务
3. ✅ **Phase 3** (2 days): 项目扫描
4. ⏳ **Phase 4** (3-4 days): 流程图画布
5. ⏳ **Phase 5** (3 days): 节点编辑器
6. ⏳ **Phase 6** (2-3 days): CRUD 操作
7. ⏳ **Phase 7** (1-2 days): 布局持久化
8. ⏳ **Phase 8** (2 days): 实时同步
9. ⏳ **Phase 9** (2 days): UI 优化
10. ⏳ **Phase 10** (2-3 days): 测试和文档

**Total**: 20-26 工作日

---

## Next Steps

- [ ] 用户审查任务分解
- [ ] 确认技术选型
- [ ] 开始 Phase 1 实施

