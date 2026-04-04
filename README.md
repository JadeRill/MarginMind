<div align="center">

<img src="addon/content/icons/icon.svg" alt="MarginMind Logo" width="120" height="120">

# MarginMind

**Zotero AI 学术助手插件**

在 Zotero 侧边栏中与 AI 讨论文献、生成摘要、提取要点，无需离开研究工作流。

[![GitHub release](https://img.shields.io/github/v/release/northword/MarginMind)](https://github.com/northword/MarginMind/releases)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Zotero](https://img.shields.io/badge/Zotero-7.x-brightgreen.svg)](https://www.zotero.org/)

[功能特性](#-功能特性) • [安装方法](#-安装方法) • [使用指南](#-使用指南) • [配置说明](#-配置说明) • [开发文档](#-开发文档) • [常见问题](#-常见问题)

</div>

---

## 📖 简介

MarginMind 是一款专为 Zotero 7 设计的 AI 学术助手插件。它将强大的 AI 对话能力无缝集成到 Zotero 的研究工作流中，帮助您：

- 📚 **深度理解文献** - 与 AI 讨论论文内容，获取专业解读
- 📝 **自动生成摘要** - 一键生成论文核心要点总结
- 🌐 **跨语言翻译** - 支持中英文学术翻译，术语准确
- 💡 **批判性分析** - 从多角度分析论文的方法论和论证
- 📄 **PDF 智能解析** - 通过 MinerU 将 PDF 转换为结构化 Markdown

## ✨ 功能特性

### AI 对话

| 功能          | 说明                           |
| ------------- | ------------------------------ |
| 流式响应      | 实时显示 AI 回复，无需等待     |
| Thinking 模式 | 展示推理模型的思考过程         |
| 多会话管理    | 创建多个独立对话，保留历史记录 |
| 上下文感知    | 自动关联当前选中的文献信息     |
| Token 计数    | 实时显示当前对话的 Token 消耗  |

### 快捷操作

- **Summarize** - 一键总结论文核心问题、方法论和关键发现
- **Explain** - 解释选中文本的专业术语和概念
- **Critique** - 批判性分析论文的假设和论证
- **Bulletize** - 将选中文本提炼为要点
- **Translate** - 中英文学术翻译，保留专业术语

### AI 提供商支持

支持 **17+** 主流 AI 提供商：

<details>
<summary>点击展开完整列表</summary>

#### 国际大厂

| 提供商    | 说明            |
| --------- | --------------- |
| OpenAI    | GPT 系列模型    |
| Anthropic | Claude 系列模型 |
| Google    | Gemini 系列模型 |

#### 国内大模型

| 提供商      | 说明                |
| ----------- | ------------------- |
| DeepSeek    | 深度求索，高性价比  |
| Moonshot AI | 月之暗面，Kimi 系列 |
| 智谱 AI     | GLM 系列模型        |
| 阿里云      | 通义千问 Qwen 系列  |
| 火山引擎    | 字节跳动豆包系列    |
| MiniMax     | 稀宇科技            |
| LongCat     | 美团                |

#### 聚合平台

| 提供商      | 说明             |
| ----------- | ---------------- |
| OpenRouter  | 全球模型聚合平台 |
| Groq        | 极速推理平台     |
| Together AI | 开源模型托管     |
| Mistral AI  | 欧洲开源大模型   |
| Cohere      | 企业级 RAG       |
| Perplexity  | 搜索增强模型     |
| SiliconFlow | 硅基流动         |

#### 自定义部署

| 提供商            | 说明                            |
| ----------------- | ------------------------------- |
| OpenAI Compatible | 支持 Ollama、One-API 等私有部署 |

</details>

### MinerU PDF 解析

- 将本地 PDF 上传至 MinerU 服务器解析为 Markdown
- 解析结果自动缓存，避免重复请求
- Markdown 内容自动注入 AI 对话上下文
- 支持缓存管理和批量清理

### 批注集成

- 在对话中选择消息并保存为 PDF 批注
- 支持右键多选模式
- 消息内容自动保存为批注评论

## 📦 安装方法

### 方式一：从 Releases 下载（推荐）

1. 前往 [Releases](https://github.com/northword/MarginMind/releases) 页面
2. 下载最新版本的 `.xpi` 文件
3. 打开 Zotero → 工具 → 附加组件
4. 点击右上角齿轮图标 → 从文件安装附加组件
5. 选择下载的 `.xpi` 文件
6. 重启 Zotero

### 方式二：从源码构建

```bash
# 克隆仓库
git clone https://github.com/northword/MarginMind.git
cd MarginMind

# 安装依赖
npm install

# 构建插件
npm run build

# 开发模式（热重载）
npm start
```

构建完成后，插件文件位于 `.scaffold/build/marginmind-*.xpi`

## 🚀 使用指南

### 基本使用

1. **打开侧边栏**
   - 点击工具栏上的 MarginMind 图标
   - 或使用快捷键（如有配置）

2. **选择文献**
   - 在 Zotero 库中选择一篇文献
   - 插件会自动加载文献的标题、作者、摘要等信息

3. **开始对话**
   - 在输入框中输入问题
   - 按 `Enter` 发送，`Shift+Enter` 换行
   - AI 会基于文献上下文回答

### 快捷操作

在阅读器中选中文本后，点击底部的快捷按钮：

```
[Summarize] [Explain selection] [Critique selection] [Bulletize selection] [Translate selection]
```

### 批注保存

1. 在对话中右键点击消息进入选择模式
2. 选择要保存的消息
3. 点击 "Save to selection" 按钮
4. 消息内容会保存为当前选中文本的注释

### MinerU PDF 解析

1. 在设置中配置 MinerU API Key
2. 打开包含 PDF 的文献
3. CONTEXT 栏会显示缓存状态：
   - 🟢 绿色：已有缓存
   - 🟡 黄色：正在解析
   - ⚫ 灰色：无缓存
4. 点击状态指示器可手动触发解析

## ⚙️ 配置说明

### AI API 配置

打开 Zotero → 编辑 → 设置 → MarginMind

| 配置项        | 说明             | 默认值     |
| ------------- | ---------------- | ---------- |
| Provider      | AI 提供商        | OpenRouter |
| API Key       | API 密钥         | -          |
| Base URL      | API 端点         | 自动填充   |
| Model         | 模型名称         | 自动填充   |
| Temperature   | 生成随机性 (0-2) | 0.2        |
| Max Tokens    | 最大生成长度     | 8192       |
| System Prompt | 系统提示词       | -          |

### MinerU 配置

1. 前往 [https://mineru.net/apiManage/token](https://mineru.net/apiManage/token) 申请 API Key
2. 在设置面板中填入 API Key
3. 缓存文件存储在 Zotero 数据目录的 `mineru_cache` 文件夹

### 预设配置

可以保存多个 AI 配置预设，快速切换不同的模型和参数：

1. 配置好 AI 参数
2. 点击 "Save" 按钮
3. 输入预设名称
4. 从下拉菜单中选择已保存的预设

## 🛠 开发文档

### 技术栈

| 技术                  | 用途              |
| --------------------- | ----------------- |
| TypeScript            | 主要开发语言      |
| React 18              | UI 框架           |
| Tailwind CSS          | 样式框架          |
| Radix UI              | 无头组件库        |
| Vercel AI SDK         | AI 流式响应       |
| zotero-plugin-toolkit | Zotero 插件工具集 |
| shadcn/ui             | UI 组件库         |
| js-tiktoken           | Token 计数        |

### 项目结构

```
MarginMind/
├── src/
│   ├── modules/           # 业务逻辑模块
│   │   ├── aiService.ts   # AI 服务封装
│   │   ├── aiPrefs.ts     # AI 配置管理
│   │   ├── mineru.ts      # MinerU API 封装
│   │   ├── markdownCache.ts # Markdown 缓存管理
│   │   ├── sidebarPanel.ts # 侧边栏面板管理
│   │   ├── toolbarButton.ts # 工具栏按钮
│   │   └── popupButtons.ts # 弹出按钮
│   ├── react/             # React 组件
│   │   ├── SidebarPanel/  # 聊天界面
│   │   │   ├── components/    # UI 组件
│   │   │   │   ├── MessageBubble.tsx    # 消息气泡
│   │   │   │   ├── InputArea.tsx         # 输入区域
│   │   │   │   ├── HeaderComponents.tsx  # 头部组件
│   │   │   │   ├── CollapsibleDetails.tsx # 可折叠详情
│   │   │   │   └── MarkdownParseButton.tsx # Markdown 解析按钮
│   │   │   ├── hooks/       # 自定义 Hooks
│   │   │   │   ├── useChatSession.ts     # 会话管理
│   │   │   │   ├── useMinerU.ts          # MinerU 解析
│   │   │   │   ├── useZoteroReader.ts   # Zotero 阅读器
│   │   │   │   └── useMessageSelection.ts # 消息选择
│   │   │   ├── SidebarPanel.tsx    # 主面板组件
│   │   │   ├── utils.ts             # 工具函数
│   │   │   ├── markdown.tsx         # Markdown 渲染
│   │   │   └── annotation-utils.ts  # 批注工具
│   │   ├── PreferencesPanel/  # 设置面板
│   │   ├── itemPane/          # 项目面板
│   │   └── components/ui/    # shadcn/ui 组件
│   └── utils/             # 工具函数
├── addon/                 # Zotero 插件资源
│   ├── content/           # 静态资源
│   ├── locale/            # 国际化文件
│   └── manifest.json      # 插件清单
└── typings/               # 类型定义
```

### 开发命令

```bash
# 开发模式（热重载）
npm start

# 构建生产版本
npm run build

# 代码检查
npm run lint:check

# 自动修复代码格式
npm run lint:fix

# 发布新版本
npm run release
```

### 代码规范

- 使用 TypeScript 进行类型安全开发
- React 组件遵循函数式编程范式
- 自定义 Hooks 封装复用逻辑
- UI 组件使用 shadcn/ui + Tailwind CSS

### 主要重构说明

项目经过深度重构，主要改进包括：

1. **Custom Hooks 提取** - 将聊天逻辑、Markdown 解析、Zotero 交互分离到独立 Hooks
2. **组件拆分** - 将大组件拆分为多个小组件，提高可维护性
3. **性能优化** - 使用本地状态避免输入时的级联重渲染
4. **错误处理** - 加强 AI 响应异常和 Zotero 环境缺失的 UI 反馈

## ❓ 常见问题

<details>
<summary><strong>Q: 插件无法安装？</strong></A>

A: 请确保：

- Zotero 版本 >= 7.0
- 下载的是 `.xpi` 文件而非源码压缩包
- 尝试重启 Zotero 后重新安装

</details>

<details>
<summary><strong>Q: AI 请求失败？</strong></A>

A: 请检查：

- API Key 是否正确
- Base URL 是否可访问
- 余额是否充足
- 模型名称是否正确

</details>

<details>
<summary><strong>Q: MinerU 解析失败？</strong></A>

A: 请确认：

- MinerU API Key 已正确配置
- PDF 文件可正常访问
- 网络连接正常
- 查看缓存目录 `mineru_cache` 是否存在

</details>

<details>
<summary><strong>Q: 如何使用本地部署的模型？</strong></A>

A: 选择 "Custom OpenAI" 提供商，填入本地服务的 Base URL（如 Ollama 的 `http://localhost:11434/v1`）

</details>

<details>
<summary><strong>Q: 流式响应不工作？</strong></A>

A: 部分 AI 提供商可能不支持流式响应，请尝试切换提供商或模型

</details>

## 📄 许可证

本项目基于 [AGPL-3.0](LICENSE) 许可证开源。

## 🙏 致谢

- [Zotero](https://www.zotero.org/) - 优秀的文献管理工具
- [zotero-plugin-toolkit](https://github.com/northword/zotero-plugin-toolkit) - Zotero 插件开发工具
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 流式响应框架
- [MinerU](https://mineru.net/) - PDF 智能解析服务
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件库

---

<div align="center">

**如果这个项目对您有帮助，请给个 ⭐ Star 支持一下！**

</div>
