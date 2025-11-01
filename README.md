# Spec-Kit Flow

A visual interface for the [Spec-Kit](https://github.com/github/spec-kit) methodology, enabling teams to visualize, edit, and manage specifications through an interactive flow-based interface.

## 🎯 Project Vision

**Spec-Kit Flow** transforms Spec-Kit Markdown documents into interactive mind maps, enabling teams to visualize, edit, and manage specifications through a visual interface.

**Core Positioning**: 
- **Content Structure Visualization**: Parse Markdown headings into mind-map nodes
- **WYSIWYG Editing**: Rich-text editor (TipTap) for non-technical users
- **Mind Map Layout**: Left-to-right tree layout (based on flowgram.ai)
- **Bidirectional Sync**: Visual edits ↔ Markdown files

## 🌟 Features (Planned)

- 🗺️ **Mind-map visualization** of Markdown document structure (headings → nodes)
- ✏️ **WYSIWYG rich-text editing** (TipTap) - no Markdown knowledge required
- 🎨 **Drag-and-drop layout** editor (based on flowgram.ai)
- 🤖 **Real-time AI integration** - visualize AI-generated content
- 🔄 **Bidirectional sync** between visual nodes and Markdown files
- 👥 **Non-technical friendly** - designed for PMs, designers, business users
- 📁 Local-first, file-system based storage

## 🏗️ Project Status

**Current Phase**: Tasks Confirmation (STEP 6)

This project follows **Spec-Driven Development (SDD)** methodology with **strict step-by-step confirmation**:

1. ✅ Write Specification (`specs/*/spec.md`) - v2.0 completed
2. ✅ User confirms spec - 8 points confirmed
3. ✅ Write Implementation Plan (`specs/*/plan.md`) - v1.0 completed
4. ✅ User confirms plan - 8 phases, 10-15 days confirmed
5. ✅ Write Task Breakdown (`specs/*/tasks.md`) - v1.0 completed
6. ⏳ **User confirms tasks** ← **Current Step**
7. ⏸️ Implementation (Phase 1-8)

**Important**: Each step must be confirmed before proceeding to the next. No document should be generated ahead of confirmation.

## 📁 Project Structure

```
spec-kit-flow/
├── memory/
│   └── constitution.md      # Project principles (v2.1 - SDD strict process)
├── specs/
│   └── 001-visual-flow-foundation/
│       ├── spec.md                    # ✅ v2.0 (confirmed by user)
│       ├── SPEC-REVIEW.md             # ✅ Confirmation checklist (8/8 ✅)
│       ├── plan.md                    # ✅ v1.0 (confirmed by user)
│       ├── tasks.md                   # ✅ v1.0 (40 tasks, 8 phases) ⏳ awaiting confirmation
│       └── MULTI-AGENT-EXECUTION.md   # ✅ 8 Agents parallel execution plan
├── templates/               # Document templates
├── CLAUDE.md               # AI agent context (updated with latest decisions)
└── README.md
```

## 🚀 Getting Started

This project is currently in initialization phase. Check back soon for setup instructions.

## 📖 Documentation

### Core Documents
- [Constitution v2.1](./memory/constitution.md) - Project principles (content structure visualization, based on flowgram.ai)
- [Spec v2.0](./specs/001-visual-flow-foundation/spec.md) - Feature specification (8 points confirmed)
- [Spec Review](./specs/001-visual-flow-foundation/SPEC-REVIEW.md) - Confirmation checklist (all confirmed ✅)
- [CLAUDE.md](./CLAUDE.md) - Current project context for AI agents

### Key Decisions
- **Core Positioning**: Content structure visualization (Markdown headings → mind-map nodes)
- **Technical Base**: Based on [flowgram.ai demo-free-layout](https://github.com/bytedance/flowgram.ai/tree/main/apps/demo-free-layout)
- **Rich-text Editing**: TipTap (WYSIWYG, no Markdown knowledge required)
- **Target Users**: Non-technical users (PMs, designers, business users)

## 🤝 Contributing

This project follows strict SDD methodology. All contributions must:
1. Align with the constitution
2. Include proper specification
3. Follow the spec → plan → tasks → implement cycle

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built on top of [Spec-Kit](https://github.com/github/spec-kit) by GitHub.
Inspired by [Flowgram.ai](https://github.com/bytedance/flowgram.ai) for layout approach.

