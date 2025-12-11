# Candidate Intake Form (候选人信息采集表)

Candidate Intake Form 是一个基于 React 和 Vite 构建的现代化候选人信息采集工具。它旨在提供安全、高效且用户体验友好的方式来收集求职者的详细信息。

## 🚀 功能特点

- **分步采集**: 将繁杂的信息采集过程分为多个逻辑板块（如个人信息、教育背景等），降低填写压力。
- **实时进度**: 侧边栏实时显示各板块的填写进度，直观展示剩余工作量。
- **多格式导出**: 支持将填写好的数据一键导出为 CSV, Markdown 和 PDF 格式，方便归档和流转。
- **响应式设计**: 完美适配桌面端和移动端，随时随地进行填写。
- **数据验证**: 内置表单验证机制，确保关键信息不遗漏。
- **一键测试**: 提供“一键填入示例数据”功能，方便开发调试和演示。

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
