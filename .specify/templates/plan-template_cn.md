# 实施计划: [FEATURE]

**分支**: `[###-feature-name]` | **日期**: [DATE] | **规格**: [link]
**输入**: 来自 `/specs/[###-feature-name]/spec.md` 的功能规格

**说明**: 此模板由 `/speckit.plan` 命令填充。执行流程见 `.specify/templates/commands/plan.md`。

## 摘要

[从功能规格中提炼：主要需求 + 技术方案（来自研究）]

## 技术背景

<!--
  需要操作：请用项目的技术细节替换本节内容。
  此结构仅作参考，用于指导迭代过程。
-->

**语言/版本**: [例如：Python 3.11、Swift 5.9、Rust 1.75 或 待澄清]  
**主要依赖**: [例如：FastAPI、UIKit、LLVM 或 待澄清]  
**存储**: [如适用，例如：PostgreSQL、CoreData、文件 或 N/A]  
**测试**: [例如：pytest、XCTest、cargo test 或 待澄清]  
**目标平台**: [例如：Linux server、iOS 15+、WASM 或 待澄清]
**项目类型**: [single/web/mobile - 决定源码结构]  
**性能目标**: [领域相关，例如：1000 req/s、10k lines/sec、60 fps 或 待澄清]  
**约束**: [领域相关，例如：p95 <200ms、内存 <100MB、离线可用 或 待澄清]  
**规模/范围**: [领域相关，例如：10k 用户、1M LOC、50 个界面 或 待澄清]

## 宪章核验

门禁：必须在第 0 阶段研究前通过。于第 1 阶段设计后复验。

[基于宪章文件确定的门禁]

## 项目结构

### 文档（本功能）

```text
specs/[###-feature]/
├── plan.md              # 本文件（/speckit.plan 命令输出）
├── research.md          # 第 0 阶段输出（/speckit.plan 命令）
├── data-model.md        # 第 1 阶段输出（/speckit.plan 命令）
├── quickstart.md        # 第 1 阶段输出（/speckit.plan 命令）
├── contracts/           # 第 1 阶段输出（/speckit.plan 命令）
└── tasks.md             # 第 2 阶段输出（/speckit.tasks 命令 - 非 /speckit.plan 生成）
```

### 源码（仓库根）
<!--
  需要操作：请用该功能的具体结构替换下方占位树。
  删除未使用的选项，并将所选结构扩展开为真实路径（如 apps/admin、packages/something）。
  交付的计划中不得保留“选项”标签。
-->

```text
# 【未使用请删除】选项 1：单项目（默认）
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# 【未使用请删除】选项 2：Web 应用（检测到“frontend + backend”时）
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# 【未使用请删除】选项 3：移动端 + API（检测到“iOS/Android”时）
api/
└── [同 backend]

ios/ 或 android/
└── [平台特定结构：功能模块、UI 流程、平台测试]
```

**结构决策**: [记录所选结构，并引用上面真实目录]

## 复杂性追踪

> 仅当宪章核验存在必须说明的违规时填写

| 违规项 | 为什么需要 | 更简单方案被拒绝的原因 |
|--------|------------|-------------------------|
| [例如：第 4 个项目] | [当前需要] | [为何 3 个项目不够] |
| [例如：Repository 模式] | [具体问题] | [为何直接访问数据库不够] |
