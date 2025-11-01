# Spec-Kit Flow

基于 flowgram.ai 的 Spec-Kit 可视化流程图编辑器

## 🎯 项目状态

**当前阶段**: Wave 1 已完成 ✅  
**执行模式**: Multi-Agent 并行开发  
**预计总时间**: 11-13 工作日

## 📋 Wave 执行进度

### ✅ Wave 1: 基础设施（1-2 天）- 已完成

**Agent-1**: 基础设施搭建
- ✅ Task 1.1: Fork flowgram.ai 项目
- ✅ Task 1.2: 安装依赖并运行
- ✅ Task 1.3: 研究项目结构 → `docs/flowgram-analysis.md`
- ✅ Task 1.4: 创建扩展目录结构
- ✅ Task 1.5: 安装扩展依赖

**Checkpoint**: ✅ 全部通过，可触发 Wave 2

---

### ⏳ Wave 2: 核心服务层（3-4 天）- 待启动

**Agent-2**: Markdown 适配层
- 任务数: 5 个
- 文件范围: `src/adapters/**/*`
- 预计时间: 3-4 天

**Agent-3**: SpecKit 识别 + 集成
- 任务数: 4 个
- 文件范围: `src/speckit/**/*`, `src/App.tsx`
- 预计时间: 2-3 天

**Agent-6**: Tauri 完整版
- 任务数: 7 个
- 文件范围: `src-tauri/**/*`, `src/services/`
- 预计时间: 3-4 天

---

### ⏳ Wave 3: UI 和功能层（3-4 天）- 待启动

**Agent-4**: 卡片扩展 + 节点管理
**Agent-5**: TipTap 富文本编辑器
**Agent-7**: 思维导图布局算法

---

### ⏳ Wave 4: 集成、优化和文档（2-3 天）- 待启动

**Agent-8**: 最终集成 + 性能优化 + 测试 + 文档

---

## 📂 项目结构

```
/workspace/
├── spec-kit-flow/           # 主应用（基于 flowgram.ai demo-free-layout）
│   ├── src/
│   │   ├── adapters/        # Markdown 适配层（Agent-2）
│   │   ├── speckit/         # SpecKit 识别器（Agent-3）
│   │   ├── layouts/         # 思维导图布局（Agent-7）
│   │   ├── components/
│   │   │   └── RichTextEditor/  # TipTap 编辑器（Agent-5）
│   │   ├── nodes/           # 节点类型定义
│   │   ├── plugins/         # 插件扩展
│   │   └── ...
│   └── package.json
│
├── docs/                    # 文档目录
│   ├── flowgram-analysis.md     # flowgram.ai 项目分析（重要！）
│   └── agent-1-checkpoint.md    # Agent-1 验收报告
│
├── specs/                   # 规格说明
│   └── 001-visual-flow-foundation/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── MULTI-AGENT-EXECUTION.md
│
└── memory/
    └── constitution.md      # 项目宪法
```

## 🚀 快速开始

### 安装依赖

```bash
cd spec-kit-flow
npm install
```

### 开发模式

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 生产构建

```bash
npm run build:prod
```

## 📚 重要文档

1. **[flowgram-analysis.md](docs/flowgram-analysis.md)** - flowgram.ai 项目深度分析
   - 核心数据结构
   - 节点注册系统
   - 配置面板架构
   - 插件系统
   - 扩展点分析
   - Spec-Kit 集成建议

2. **[agent-1-checkpoint.md](docs/agent-1-checkpoint.md)** - Wave 1 验收报告
   - Checkpoint 验证结果
   - 关键决策记录
   - 注意事项

3. **[MULTI-AGENT-EXECUTION.md](specs/001-visual-flow-foundation/MULTI-AGENT-EXECUTION.md)** - 多 Agent 执行计划
   - 8 个 Agent 分工
   - 4 个 Wave 执行时间线
   - 每个 Agent 的详细提示词

## 🛠 技术栈

**核心框架**:
- React 18
- TypeScript 5.8
- @flowgram.ai/free-layout-editor v1.0.2

**Markdown 处理**:
- unified v11.0.5
- remark-parse v11.0.0
- remark-stringify v11.0.2

**富文本编辑**:
- @tiptap/react v3.10.1
- tiptap-markdown v0.9.0

**UI 组件**:
- @douyinfe/semi-ui v2.80.0

**构建工具**:
- Rsbuild v1.6.0

## 📊 进度统计

| Wave | Agent 数量 | 任务数 | 状态 | 预计时间 |
|------|-----------|--------|------|---------|
| Wave 1 | 1 | 5 | ✅ 完成 | 1-2 天 |
| Wave 2 | 3 | 16 | ⏳ 待启动 | 3-4 天 |
| Wave 3 | 3 | 18 | ⏳ 待启动 | 3-4 天 |
| Wave 4 | 1 | 8 | ⏳ 待启动 | 2-3 天 |
| **总计** | **8** | **47** | **19%** | **11-13 天** |

## 🎯 下一步

**启动 Wave 2（3 个 Agent 并行）**:

1. Agent-2: Markdown 适配层
2. Agent-3: SpecKit 识别 + 集成
3. Agent-6: Tauri 完整版

**执行方式**: 使用 Cursor Multi-Agents 功能，基于 `integration/wave-2` 分支并行开发

## 📝 License

MIT
