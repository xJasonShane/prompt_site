# AI绘图元数据管理系统

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cloudflare%20R2-000000?style=for-the-badge&logo=cloudflare" alt="Cloudflare R2" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  <img src="https://img.shields.io/github/stars/your-username/prompt-site.svg?style=social" alt="GitHub Stars" />
  <img src="https://img.shields.io/github/forks/your-username/prompt-site.svg?style=social" alt="GitHub Forks" />
</div>

一个功能完整、高性能的AI绘图元数据管理系统，支持上传、存储、搜索和展示AI生成的图片及其详细元数据。系统采用现代化技术栈构建，支持在Cloudflare Pages、Vercel、GitHub Pages等主流平台部署。

## 📋 项目简介

AI绘图元数据管理系统专为AI艺术创作者设计，帮助用户管理和分享AI生成的图片及其详细生成参数。系统支持完整的元数据管理，包括正向/负向提示词、模型信息、生成参数和LoRA模型等，同时提供强大的搜索和筛选功能，让用户轻松找到想要的图片。

### 项目架构

```
┌────────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│ 前端应用          │     │ 后端API         │     │ 数据存储         │
│ (Next.js + React)  │────▶│ (Next.js API)    │────▶│ SQLite + Cloudflare R2 │
└────────────────────┘     └──────────────────┘     └───────────────────┘
        │                         │
        │                         │
        └─────────────────────────┘
                ▲
                │
        ┌──────────────────┐
        │ 认证系统        │
        │ (NextAuth.js)   │
        └──────────────────┘
```

## ✨ 功能特性

### 📤 图片管理
- **上传与存储** - 支持Cloudflare R2对象存储，安全可靠
- **批量上传** - 支持同时上传多张图片
- **图片预览** - 上传前实时预览图片效果
- **图片优化** - 自动优化图片大小和格式

### 📝 元数据管理
- **完整的生成参数**
  - 正向/负向提示词
  - AI模型信息（名称、版本）
  - 生成参数（步数、CFG、种子、采样器、尺寸）
  - LoRA模型管理（名称、权重）
- **自动提取元数据** - 支持从图片中自动提取生成参数
- **元数据编辑** - 支持编辑和更新元数据

### 🖼️ 图片展示
- **响应式瀑布流** - 适配各种设备尺寸
- **图片详情页** - 完整展示图片和元数据
- **图片缩放** - 支持点击放大查看图片
- **下载功能** - 支持下载原图和元数据

### 🔍 搜索与筛选
- **多维度搜索** - 支持按提示词、模型、参数等搜索
- **高级筛选** - 支持按生成参数范围筛选
- **快速搜索** - 实时搜索结果展示
- **排序功能** - 支持按时间、热度等排序

### 👤 用户系统
- **认证系统** - 基于NextAuth.js，支持多种登录方式
- **用户个人中心** - 管理个人上传的图片
- **权限管理** - 支持管理员和普通用户角色

### 🌙 设计与体验
- **深色/浅色模式** - 自动跟随系统或手动切换
- **完全响应式** - 移动端、平板、桌面端完美适配
- **流畅动画** - 平滑的过渡效果
- **无障碍支持** - 符合WCAG标准

### 🚀 性能与部署
- **高性能** - 优化的图片加载、API响应和数据库查询
- **CI/CD集成** - 自动测试和部署
- **多平台支持** - 支持Cloudflare Pages、Vercel、GitHub Pages、Docker等
- **环境变量配置** - 灵活的环境变量管理

### 🔧 开发与扩展
- **TypeScript** - 完整的类型支持
- **模块化设计** - 易于扩展和定制
- **API文档** - 完整的API接口文档
- **测试覆盖** - 完善的测试套件

## 🛠️ 技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| **前端框架** | Next.js | 14.x | 应用框架，支持SSR和ISR |
| **UI组件库** | shadcn/ui | 最新 | 现代化UI组件，基于Radix UI |
| **样式方案** | Tailwind CSS | 3.x | 实用优先的CSS框架 |
| **数据库** | SQLite + Drizzle ORM | 最新 | 轻量级数据库和ORM |
| **对象存储** | Cloudflare R2 | 最新 | 高性能对象存储服务 |
| **认证系统** | NextAuth.js | 5.x | 灵活的认证解决方案 |
| **表单处理** | React Hook Form + Zod | 最新 | 高性能表单处理和验证 |
| **语言** | TypeScript | 5.x | 类型安全的JavaScript超集 |
| **构建工具** | Next.js Build | 14.x | 优化的构建和部署工具 |
| **CI/CD** | GitHub Actions | 最新 | 自动化测试和部署 |

## 🚀 快速开始

### 环境要求

在开始之前，请确保您已安装以下软件：

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | 18.17+ 或 20.6+ | 推荐使用 Node.js 20 LTS |
| 包管理器 | npm 9+ 或 yarn 1.x | 建议使用 npm |
| Git | 最新稳定版 | 用于版本控制 |
| Cloudflare 账号 | - | 用于 R2 对象存储和 Pages 部署 |

### 安装步骤

#### 1. 克隆仓库

```bash
git clone https://github.com/your-username/prompt-site.git
cd prompt-site
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置环境变量

1. 复制示例环境变量文件
   ```bash
   cp .env.example .env.local
   ```
   
2. 使用文本编辑器打开 `.env.local`，根据实际情况配置以下变量：
   ```env
   # 数据库配置（使用 SQLite，无需额外安装）
   DATABASE_URL="file:./prompt_site.db"
   
   # NextAuth 配置
   NEXTAUTH_SECRET="your-secret-key-here"  # 用于加密会话，必须唯一且复杂
   NEXTAUTH_URL="http://localhost:3000"    # 开发环境使用本地地址
   
   # Cloudflare R2 存储配置
   R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"  # R2 端点 URL
   R2_ACCESS_KEY_ID="your-access-key-id"                            # R2 访问密钥 ID
   R2_SECRET_ACCESS_KEY="your-secret-access-key"                    # R2 秘密访问密钥
   R2_BUCKET_NAME="prompt-images"                                  # R2 存储桶名称
   ```
   
3. **生成安全的 NEXTAUTH_SECRET**：
   ```bash
   # 在 Linux/macOS 上
   openssl rand -base64 32
   
   # 在 Windows PowerShell 上
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

#### 4. 初始化数据库

```bash
# 生成数据库迁移文件（首次使用）
npm run db:generate

# 将数据库结构推送到 SQLite 文件
npm run db:push
```

#### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 验证安装

应用启动后，您应该能够：
- ✅ 访问首页并看到欢迎界面
- ✅ 点击"上传"按钮进入上传页面
- ✅ 看到登录/注册选项
- ✅ 测试上传功能（需要配置正确的 R2 存储）

### 常见问题

如果遇到问题，请检查：
- ✅ 环境变量配置是否正确
- ✅ 数据库是否成功初始化
- ✅ 端口 3000 是否被占用
- ✅ Cloudflare R2 配置是否正确

### 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行代码检查 |
| `npm run db:generate` | 生成数据库迁移文件 |
| `npm run db:push` | 直接推送数据库更改 |
| `npm run db:studio` | 打开 Drizzle Studio 数据库管理界面 |

## 📦 部署指南

详细的部署教程已拆分到独立的文档中，您可以通过以下方式访问：

- 📄 **完整部署指南**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 文件

### 部署选项

系统支持在多种平台部署，具体步骤请参考部署指南：

| 平台 | 部署文档位置 | 特点 |
|------|--------------|------|
| Cloudflare Pages | [DEPLOYMENT.md#1-cloudflare-pages-部署](./DEPLOYMENT.md#1-cloudflare-pages-部署) | 边缘计算，高性能，与R2存储无缝集成 |
| Vercel | [DEPLOYMENT.md#2-vercel-部署](./DEPLOYMENT.md#2-vercel-部署) | 简单易用，自动部署，优秀的开发者体验 |
| GitHub Pages | [DEPLOYMENT.md#3-github-pages-部署](./DEPLOYMENT.md#3-github-pages-部署) | 免费，与GitHub集成，适合静态网站 |
| Docker | [DEPLOYMENT.md#4-docker-部署](./DEPLOYMENT.md#4-docker-部署) | 完全控制，可移植性强，适合复杂部署 |

### 环境变量快速参考

部署前需要配置以下关键环境变量：

| 变量名 | 描述 | 必填 |
|--------|------|------|
| `DATABASE_URL` | 数据库连接字符串 | ✅ |
| `NEXTAUTH_SECRET` | NextAuth加密密钥 | ✅ |
| `NEXTAUTH_URL` | 应用完整URL | ✅ |
| `R2_ENDPOINT` | Cloudflare R2端点 | ✅ |
| `R2_ACCESS_KEY_ID` | R2访问密钥ID | ✅ |
| `R2_SECRET_ACCESS_KEY` | R2秘密访问密钥 | ✅ |
| `R2_BUCKET_NAME` | R2存储桶名称 | ✅ |

完整的环境变量配置和生成方法请参考 [DEPLOYMENT.md#环境变量配置](./DEPLOYMENT.md#环境变量配置)。

### 部署最佳实践

- ✅ 使用环境变量管理敏感信息
- ✅ 配置适当的访问控制和权限
- ✅ 启用CDN加速静态资源
- ✅ 配置监控和日志系统
- ✅ 定期备份数据库和重要数据
- ✅ 实施CI/CD自动化部署

### 故障排除

如果部署过程中遇到问题，请参考：
- [DEPLOYMENT.md#故障排除指南](./DEPLOYMENT.md#故障排除指南)

## 🤝 贡献指南

我们欢迎社区贡献！如果您想为项目做出贡献，请遵循以下步骤：

### 贡献流程

1. **Fork 项目**
2. **创建分支**：`git checkout -b feature/your-feature`
3. **开发功能**：实现您的功能或修复bug
4. **测试**：确保代码通过lint和测试
5. **提交代码**：`git add . && git commit -m "feat: add your feature"`
6. **推送分支**：`git push origin feature/your-feature`
7. **创建PR**：在GitHub上创建Pull Request

### 贡献规范

- 遵循项目的代码风格和命名规范
- 编写清晰的提交信息
- 添加适当的测试用例
- 更新相关文档
- 确保代码通过lint检查

## 📄 许可证信息

本项目采用 [MIT License](LICENSE) 许可证。

## 📞 联系方式

如果您有任何问题或建议，请通过以下方式联系我们：

- 📧 电子邮件：support@example.com
- 🐛 GitHub Issues：[提交问题](https://github.com/your-username/prompt-site/issues)
- 💬 Discord：[加入我们的社区](https://discord.gg/your-server)

## 🌟 致谢

感谢所有为本项目做出贡献的开发者和支持者！

---

**享受使用AI绘图元数据管理系统！** 🚀