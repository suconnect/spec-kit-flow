# Spec-Kit Flow

A visual interface for the [Spec-Kit](https://github.com/github/spec-kit) methodology, enabling teams to visualize, edit, and manage specifications through an interactive flow-based interface.

## 🎯 Project Vision

Bridge the gap between AI-driven spec-driven development and human-friendly visual workflows by providing an intuitive, visual interface for managing spec-kit projects.

## 🌟 Features (Planned)

- 📊 Visual representation of spec-kit documents (constitution, specs, plans, tasks)
- ✏️ Interactive editing with markdown support
- 🤖 Real-time AI execution state monitoring
- 🔄 Synchronization between visual interface and AI agents
- 🛠️ CLI tool integration framework
- 📁 Local-first, file-system based storage

## 🏗️ Project Status

**Current Phase**: Initialization

This project follows **Spec-Driven Development (SDD)** methodology. All features go through:
1. Specification (`specs/`)
2. Implementation Plan (`specs/*/plan.md`)
3. Task Breakdown (`specs/*/tasks.md`)
4. Implementation

## 📁 Project Structure

```
spec-kit-flow/
├── memory/
│   └── constitution.md      # Project principles and constraints
├── specs/                   # Feature specifications
├── templates/               # Document templates
│   ├── CLAUDE-template.md
│   ├── spec-template.md
│   ├── plan-template.md
│   └── tasks-template.md
├── scripts/                 # Utility scripts
├── CLAUDE.md               # AI agent context
└── README.md
```

## 🚀 Getting Started

This project is currently in initialization phase. Check back soon for setup instructions.

## 📖 Documentation

- [Constitution](./memory/constitution.md) - Project principles and technical constraints
- [CLAUDE.md](./CLAUDE.md) - Current project context for AI agents

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

