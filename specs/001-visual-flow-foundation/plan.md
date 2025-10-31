# Visual Flow Foundation - Implementation Plan

## Architecture Overview

本功能采用分层架构，将 UI 层、业务逻辑层和数据层分离，确保代码的可维护性和可测试性。

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ FlowCanvas   │  │ NodeEditor   │  │ ToolBar      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                  State Management (Zustand)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Flow Store   │  │ Editor Store │  │ Layout Store │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                  Business Logic Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ FileScanner  │  │ FileWatcher  │  │ LayoutMgr    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                    Data Layer (Tauri)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ File System  │  │ FS Watcher   │  │ JSON Store   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Technology Decisions

#### Frontend Stack
- **React 18.2+**: 使用现代 React Hooks 和并发特性
- **TypeScript 5.0+**: 严格模式，完整类型安全
- **Vite 5.0+**: 快速开发和构建
- **ReactFlow 11.x**: 成熟的流程图库，比从零实现更可靠（改变决策：不使用 flowgram.ai，使用 ReactFlow）

#### Desktop Framework
- **Tauri 1.5+**: 
  - 更小的打包体积（vs Electron）
  - 更好的性能
  - 安全的文件系统访问
  - Rust 后端提供可靠的文件监听

#### State Management
- **Zustand 4.x**: 
  - 轻量级
  - TypeScript 友好
  - 无需 Provider 包裹
  - 易于测试

#### Markdown Editing
- **react-markdown**: 渲染预览
- **@uiw/react-codemirror**: 编辑器
  - 语法高亮
  - 自动补全
  - Vim/Emacs 模式支持

## Components

### Component 1: Project Scaffold (项目脚手架)
**Responsibility**: 建立 Tauri + React + Vite 项目基础
**Dependencies**: Node.js, Rust
**Key Files**:
- `src-tauri/Cargo.toml`
- `src-tauri/tauri.conf.json`
- `src/main.tsx`
- `vite.config.ts`
- `tsconfig.json`

### Component 2: FlowCanvas (流程图画布)
**Responsibility**: 渲染和管理节点流程图
**Dependencies**: ReactFlow
**Key Files**:
- `src/components/FlowCanvas/FlowCanvas.tsx`
- `src/components/FlowCanvas/CustomNode.tsx`
- `src/components/FlowCanvas/CustomEdge.tsx`
- `src/components/FlowCanvas/controls.tsx`

### Component 3: NodeEditor (节点编辑器)
**Responsibility**: 显示和编辑节点内容
**Dependencies**: CodeMirror, react-markdown
**Key Files**:
- `src/components/NodeEditor/NodeEditor.tsx`
- `src/components/NodeEditor/MarkdownPreview.tsx`
- `src/components/NodeEditor/EditorToolbar.tsx`

### Component 4: FileSystemService (文件系统服务)
**Responsibility**: 处理所有文件系统操作
**Dependencies**: Tauri File System API
**Key Files**:
- `src-tauri/src/fs_service.rs`
- `src/services/fileSystem.ts`

### Component 5: FileWatcherService (文件监听服务)
**Responsibility**: 监听文件系统变化并通知前端
**Dependencies**: Tauri, chokidar (Rust: notify crate)
**Key Files**:
- `src-tauri/src/watcher.rs`
- `src/services/fileWatcher.ts`

### Component 6: SpecKitScanner (项目扫描器)
**Responsibility**: 扫描 spec-kit 项目结构生成节点数据
**Dependencies**: FileSystemService
**Key Files**:
- `src/services/specKitScanner.ts`
- `src/types/speckit.ts`

### Component 7: LayoutManager (布局管理器)
**Responsibility**: 保存和恢复节点布局
**Dependencies**: FileSystemService
**Key Files**:
- `src/services/layoutManager.ts`
- `src/stores/layoutStore.ts`

### Component 8: State Stores (状态管理)
**Responsibility**: 全局状态管理
**Dependencies**: Zustand
**Key Files**:
- `src/stores/flowStore.ts` - 流程图节点和边
- `src/stores/editorStore.ts` - 编辑器状态
- `src/stores/appStore.ts` - 应用全局状态

## Implementation Phases

### Phase 1: 项目初始化和基础设施 (Foundation)
**Goal**: 建立开发环境和项目脚手架
**Duration**: 1-2 days

**Tasks**:
- [ ] 初始化 Tauri 项目 (`npm create tauri-app`)
- [ ] 配置 TypeScript 严格模式
- [ ] 设置 Vite 配置（路径别名、环境变量）
- [ ] 安装核心依赖（React, ReactFlow, Zustand）
- [ ] 配置 ESLint + Prettier
- [ ] 设置测试环境（Vitest, Testing Library）
- [ ] 创建基础目录结构 (`src/components`, `src/services`, `src/stores`, `src/types`)
- [ ] 实现基础 Tauri 命令（打开项目目录选择对话框）

**Validation**: 
- ✅ `npm run dev` 启动开发服务器
- ✅ Tauri 窗口打开并显示 "Hello World"
- ✅ TypeScript 无错误
- ✅ 测试运行通过

### Phase 2: 文件系统服务 (File System Core)
**Goal**: 实现文件系统读写和监听功能
**Duration**: 2-3 days

**Tasks**:
- [ ] 实现 Tauri 文件系统命令 (Rust)
  - `read_file(path)` - 读取文件内容
  - `write_file(path, content)` - 写入文件
  - `delete_file(path)` - 删除文件
  - `create_directory(path)` - 创建目录
  - `list_directory(path)` - 列出目录内容
  - `select_directory()` - 打开目录选择对话框
- [ ] 实现文件监听服务 (Rust: notify crate)
  - 监听指定目录的变化
  - 通过事件发送到前端
- [ ] 创建前端 TypeScript 包装器 (`src/services/fileSystem.ts`)
- [ ] 编写单元测试（模拟文件操作）

**Validation**:
- ✅ 能够选择项目目录
- ✅ 能够读取 spec-kit 项目的所有 .md 文件
- ✅ 文件修改能触发事件通知
- ✅ 所有测试通过

### Phase 3: Spec-Kit 项目扫描 (Project Scanner)
**Goal**: 解析 spec-kit 项目结构生成节点数据
**Duration**: 2 days

**Tasks**:
- [ ] 定义 TypeScript 类型 (`src/types/speckit.ts`)
  - `SpecKitNode` - 节点数据结构
  - `SpecKitProject` - 项目数据结构
- [ ] 实现 `SpecKitScanner` 类
  - 扫描 `memory/constitution.md`
  - 扫描 `specs/*/spec.md`
  - 扫描 `specs/*/plan.md`
  - 扫描 `specs/*/tasks.md`
  - 解析文件元数据（标题、修改时间）
  - 建立节点层级关系
- [ ] 实现默认布局算法（简单的树形布局）
- [ ] 编写单元测试（使用测试数据）

**Validation**:
- ✅ 能够扫描当前 spec-kit-flow 项目
- ✅ 正确识别 constitution、spec、plan 文档
- ✅ 节点层级关系正确
- ✅ 测试覆盖率 > 80%

### Phase 4: 流程图画布 (Flow Canvas)
**Goal**: 实现可交互的流程图展示
**Duration**: 3-4 days

**Tasks**:
- [ ] 创建 `FlowCanvas` 组件
  - 集成 ReactFlow
  - 配置画布控制器（缩放、平移）
  - 实现小地图导航
- [ ] 创建自定义节点组件 `CustomNode`
  - 显示节点类型图标（constitution 👑, spec 📄, plan 📋, task ✅）
  - 显示文档标题
  - 显示状态标识
  - 支持选中状态
- [ ] 创建自定义边组件 `CustomEdge`
  - 层级关系用直线连接
  - 平滑曲线
- [ ] 实现节点拖拽功能
  - 单个节点拖拽
  - 多选批量拖拽
  - 拖拽时连接线实时更新
- [ ] 实现上下文菜单
  - 右键节点：编辑、删除
  - 右键画布：新建 spec
- [ ] 连接 Zustand store (`flowStore`)

**Validation**:
- ✅ 流程图正确显示所有节点和连接
- ✅ 拖拽操作流畅（60 FPS）
- ✅ 缩放和平移正常工作
- ✅ 上下文菜单显示正确

### Phase 5: 节点编辑器 (Node Editor)
**Goal**: 实现 Markdown 内容查看和编辑
**Duration**: 3 days

**Tasks**:
- [ ] 创建 `NodeEditor` 组件
  - 侧边栏面板布局
  - 显示文件路径和元数据
  - 关闭按钮
- [ ] 集成 CodeMirror 编辑器
  - Markdown 语法高亮
  - 行号显示
  - 自动保存（防抖 1 秒）
- [ ] 实现 Markdown 预览 (`MarkdownPreview`)
  - 使用 react-markdown 渲染
  - 支持代码块语法高亮
  - 支持表格、列表等
- [ ] 实现编辑工具栏 (`EditorToolbar`)
  - 保存按钮
  - 预览切换
  - 全屏模式
- [ ] 连接 `editorStore`
  - 当前编辑的节点
  - 编辑内容
  - 保存状态

**Validation**:
- ✅ 双击节点打开编辑器
- ✅ 编辑器显示正确的内容
- ✅ Markdown 语法高亮正常
- ✅ 预览渲染正确
- ✅ 保存后文件内容更新

### Phase 6: CRUD 操作 (Create, Read, Update, Delete)
**Goal**: 完整的文档生命周期管理
**Duration**: 2-3 days

**Tasks**:
- [ ] 实现创建文档功能
  - 从模板创建新 spec
  - 自动生成目录（`specs/XXX-feature-name/`）
  - 从 `templates/spec-template.md` 复制内容
  - 在流程图中添加新节点
- [ ] 实现更新文档功能
  - 编辑器保存触发文件写入
  - 更新节点元数据（修改时间）
- [ ] 实现删除文档功能
  - 确认对话框
  - 删除文件和目录
  - 从流程图移除节点
  - 移到系统回收站（而非永久删除）
- [ ] 实现撤销/重做功能
  - 使用 `zustand/middleware` 的历史中间件
  - 支持 Ctrl+Z / Ctrl+Shift+Z

**Validation**:
- ✅ 能够创建新的 spec 文档
- ✅ 编辑内容能正确保存
- ✅ 删除操作能移除文件和节点
- ✅ 撤销/重做正常工作

### Phase 7: 布局持久化 (Layout Persistence)
**Goal**: 保存和恢复用户自定义布局
**Duration**: 1-2 days

**Tasks**:
- [ ] 实现 `LayoutManager` 服务
  - 保存布局到 `.speckit-flow/layout.json`
  - 加载布局数据
  - 合并新节点到已有布局
- [ ] 实现布局数据版本化
  - 检测版本不兼容
  - 提供迁移逻辑
- [ ] 实现自动保存
  - 节点位置变化后 2 秒自动保存
  - 防抖处理避免频繁写入
- [ ] 实现布局重置功能
  - 恢复默认树形布局
  - 保留用户确认

**Validation**:
- ✅ 拖拽节点后刷新页面，位置保持不变
- ✅ `.speckit-flow/layout.json` 文件正确生成
- ✅ 布局数据损坏时能回退到默认布局

### Phase 8: 文件系统同步 (Real-time Sync)
**Goal**: 外部文件变化实时反映到界面
**Duration**: 2 days

**Tasks**:
- [ ] 实现文件监听事件处理
  - 文件创建 → 添加新节点
  - 文件修改 → 更新节点状态（显示"已修改"标识）
  - 文件删除 → 移除节点
- [ ] 实现冲突处理
  - 检测编辑器中的内容是否与磁盘不同步
  - 提供"重新加载"或"覆盖"选项
- [ ] 实现同步状态指示器
  - 显示"同步中"、"已同步"、"冲突"状态
  - Toast 通知文件变化
- [ ] 优化性能
  - 防抖处理批量文件变化
  - 避免无限循环（编辑器保存 → 触发监听 → 更新编辑器）

**Validation**:
- ✅ 外部编辑器修改文件后，流程图实时更新
- ✅ AI 创建新文件后，自动添加节点
- ✅ 冲突时显示提示
- ✅ 无性能问题和无限循环

### Phase 9: UI 优化和无障碍 (UI Polish & Accessibility)
**Goal**: 提升用户体验和可访问性
**Duration**: 2 days

**Tasks**:
- [ ] 实现键盘快捷键
  - `Ctrl+N` - 新建 spec
  - `Ctrl+S` - 保存当前文档
  - `Ctrl+Z` / `Ctrl+Shift+Z` - 撤销/重做
  - `Ctrl+F` - 搜索节点
  - `Delete` - 删除选中节点
- [ ] 实现工具栏 (`ToolBar`)
  - 打开项目按钮
  - 刷新按钮
  - 布局重置
  - 缩放控制
- [ ] 实现欢迎界面
  - 打开现有项目
  - 创建新项目
  - 最近打开的项目列表
- [ ] 优化视觉设计
  - 统一配色方案
  - 节点阴影和动画
  - 深色模式支持
- [ ] 无障碍改进
  - ARIA 标签
  - 键盘导航
  - 屏幕阅读器支持

**Validation**:
- ✅ 所有快捷键正常工作
- ✅ 界面美观、直观
- ✅ 通过 WCAG 2.1 AA 检查

### Phase 10: 测试和文档 (Testing & Documentation)
**Goal**: 确保质量和可维护性
**Duration**: 2-3 days

**Tasks**:
- [ ] 编写单元测试
  - Services: 80%+ 覆盖率
  - Stores: 80%+ 覆盖率
  - Utils: 90%+ 覆盖率
- [ ] 编写组件测试
  - FlowCanvas: 主要交互流程
  - NodeEditor: 编辑和保存
  - CustomNode: 渲染和事件
- [ ] 端到端测试（Playwright）
  - 打开项目流程
  - 创建-编辑-删除流程
  - 文件同步流程
- [ ] 编写用户文档
  - README.md: 快速开始
  - docs/user-guide.md: 完整使用指南
  - docs/architecture.md: 架构说明
- [ ] 编写开发者文档
  - docs/development.md: 开发环境设置
  - docs/contributing.md: 贡献指南
  - 代码注释完善

**Validation**:
- ✅ 所有测试通过
- ✅ 测试覆盖率达标
- ✅ 文档完整且准确

## Testing Strategy

### Unit Testing
- **Framework**: Vitest
- **Coverage Target**: 80%+ for services and stores
- **Mocking**: 文件系统操作使用 mock

### Component Testing
- **Framework**: React Testing Library + Vitest
- **Focus**: 用户交互和事件处理

### E2E Testing
- **Framework**: Playwright
- **Scenarios**: 
  - 完整的用户工作流
  - 跨平台测试（Windows, macOS, Linux）

### Performance Testing
- **Tools**: Chrome DevTools, React DevTools Profiler
- **Metrics**: 
  - 初始加载时间 < 2s
  - 拖拽响应 < 16ms

## Deployment Considerations

### Build Process
1. `npm run build` - 构建前端资源
2. `npm run tauri build` - 打包 Tauri 应用
3. 生成平台特定安装包：
   - Windows: `.msi`, `.exe`
   - macOS: `.dmg`, `.app`
   - Linux: `.deb`, `.appimage`

### Distribution
- GitHub Releases 发布
- 自动更新机制（Tauri updater）

### Platform-Specific Notes
- **Windows**: 需要 WebView2 运行时
- **macOS**: 需要代码签名（可选）
- **Linux**: 依赖 webkit2gtk

## Rollback Plan

如果在实施过程中遇到重大问题：

1. **ReactFlow 性能问题** → 回退到 canvas 原生实现（备选方案）
2. **Tauri 兼容性问题** → 迁移到 Electron（备选方案）
3. **Zustand 状态管理复杂** → 切换到 Jotai 或 Redux Toolkit

## Timeline Estimate

总计：**20-26 工作日**（约 4-5 周）

- Phase 1: 1-2 days
- Phase 2: 2-3 days
- Phase 3: 2 days
- Phase 4: 3-4 days
- Phase 5: 3 days
- Phase 6: 2-3 days
- Phase 7: 1-2 days
- Phase 8: 2 days
- Phase 9: 2 days
- Phase 10: 2-3 days

## References

- [ReactFlow Documentation](https://reactflow.dev/learn)
- [Tauri Guides](https://tauri.app/v1/guides/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [CodeMirror 6 Documentation](https://codemirror.net/docs/)

