# Candidate Intake Form (候选人信息采集表)

Candidate Intake Form 是一个基于 React 和 Vite 构建的现代化候选人信息采集工具。它旨在提供安全、高效且用户体验友好的方式来收集求职者的详细信息。

## 🚀 功能特点

- **分步采集**: 将繁杂的信息采集过程分为多个逻辑板块（如个人信息、教育背景等），降低填写压力。
- **实时进度**: 侧边栏实时显示各板块的填写进度，直观展示剩余工作量。
- **多格式导出**: 支持将填写好的数据一键导出为 CSV, Markdown 和 PDF 格式，方便归档和流转。
- **响应式设计**: 完美适配桌面端和移动端，随时随地进行填写。
- **数据验证**: 内置表单验证机制，确保关键信息不遗漏。
- **一键测试**: 提供“一键填入示例数据”功能，方便开发调试和演示。
- **隐私优先**: 纯前端运行，数据仅存储在本地浏览器，无需担心隐私泄露。

## 🔒 隐私与安全 (Privacy & Security)

本项目是一个 **隐私优先 (Privacy First)** 的应用程序。

- **纯客户端运行**: 所有的代码逻辑完全在您的浏览器中运行。
- **零数据上传**: 您填写的所有信息（包括个人资料、教育背景等）**绝不会** 被上传到任何服务器或数据库。
- **数据完全掌控**: 数据仅保存在当前页面的内存状态中。刷新页面后，所有未导出的数据将彻底清除，不留痕迹。
- **无需后端**: 项目没有配置后端 API 接口，从架构上杜绝了数据被远程收集的可能性。

## 🛠️ 技术栈

- **核心框架**: [React 19](https://react.dev/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
- **图标库**: [Lucide React](https://lucide.dev/)
- **PDF 生成**: [jsPDF](https://github.com/parallax/jsPDF)
- **开发语言**: TypeScript

## 📦 安装与运行

确保你的本地环境已安装 Node.js (推荐 v18+)。

1. **安装依赖**

   ```bash
   npm install
   ```

2. **启动开发服务器**

   ```bash
   npm run dev
   ```

   服务启动后，通常访问 `http://localhost:3000` 即可看到应用。

3. **构建生产版本**

   ```bash
   npm run build
   ```

   构建产物将输出到 `dist` 目录。

4. **预览生产构建**

   ```bash
   npm run preview
   ```

## 📂 项目结构

```
CandidateIntakeForm/
├── components/       # 通用组件 (如 FieldInput)
├── services/         # 业务逻辑服务 (如 exportService)
├── constants.ts      # 常量定义 (字段配置, 示例数据)
├── types.ts          # TypeScript 类型定义
├── App.tsx           # 主应用入口
└── ...
```

## 📄 许可证

Private / Proprietary
