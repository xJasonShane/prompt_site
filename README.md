# AI绘图元数据管理网站

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Cloudflare%20R2-000000?style=for-the-badge&logo=cloudflare" alt="Cloudflare R2" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</div>

一个功能完整的AI绘图元数据管理系统，支持在Cloudflare Pages、Vercel、GitHub Pages等主流平台部署。

## ✨ 功能特性

- 📤 **图片上传与存储** - 支持Cloudflare R2对象存储，安全可靠
- 📝 **完整的元数据管理**
  - 正向/负向提示词
  - AI模型信息（名称、版本）
  - 生成参数（步数、CFG、种子、采样器、尺寸）
  - LoRA模型管理
- 🖼️ **响应式图片展示** - 瀑布流布局，适配各种设备
- 🔍 **强大的搜索功能** - 支持按提示词、模型、参数等多维度搜索
- 👤 **用户认证系统** - 基于NextAuth.js，支持多种登录方式
- 🌙 **深色模式支持** - 自动跟随系统或手动切换
- 📱 **完全响应式设计** - 移动端、平板、桌面端完美适配
- 🚀 **高性能** - 优化的图片加载、API响应和数据库查询
- 🔧 **CI/CD集成** - 自动测试和部署

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Next.js | 14.x |
| UI组件库 | shadcn/ui | 最新 |
| 样式方案 | Tailwind CSS | 3.x |
| 数据库 | SQLite + Drizzle ORM | 最新 |
| 对象存储 | Cloudflare R2 | 最新 |
| 认证系统 | NextAuth.js | 5.x |
| 表单验证 | React Hook Form + Zod | 最新 |
| 语言 | TypeScript | 5.x |

## 🚀 快速开始

### 环境要求

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | 18.17+ 或 20.6+ | 推荐使用 Node.js 20 LTS |
| 包管理器 | npm 9+ 或 yarn 1.x | 建议使用 npm |
| Git | 最新稳定版 | 用于版本控制 |
| Cloudflare 账号 | - | 用于 R2 对象存储和 Pages 部署 |

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/your-username/prompt-site.git
cd prompt-site
```

2. **安装依赖**

```bash
npm install
# 或使用 yarn（不推荐，可能存在兼容性问题）
# yarn install
```

3. **配置环境变量**

   - 复制示例环境变量文件
   ```bash
   cp .env.example .env.local
   ```
   
   - 使用文本编辑器打开 `.env.local`，根据实际情况配置以下变量：
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
   
   - **生成安全的 NEXTAUTH_SECRET**：
   ```bash
   # 在 Linux/macOS 上
   openssl rand -base64 32
   
   # 在 Windows PowerShell 上
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

4. **初始化数据库**

```bash
# 生成数据库迁移文件（首次使用）
npm run db:generate

# 将数据库结构推送到 SQLite 文件
npm run db:push
```

5. **启动开发服务器**

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 验证安装

应用启动后，您应该能够：
- 访问首页并看到欢迎界面
- 点击"上传"按钮进入上传页面
- 看到登录/注册选项

如果遇到问题，请检查：
- 环境变量配置是否正确
- 数据库是否成功初始化
- 端口 3000 是否被占用

## 📦 部署指南

详细的部署教程已拆分到独立的文档中，您可以通过以下方式访问：

- 📄 **完整部署指南**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 文件

### 部署选项

系统支持在多种平台部署，具体步骤请参考部署指南：

| 平台 | 部署文档位置 |
|------|--------------|
| Cloudflare Pages | [DEPLOYMENT.md#1-cloudflare-pages-部署](./DEPLOYMENT.md#1-cloudflare-pages-部署) |
| Vercel | [DEPLOYMENT.md#2-vercel-部署](./DEPLOYMENT.md#2-vercel-部署) |
| GitHub Pages | [DEPLOYMENT.md#3-github-pages-部署](./DEPLOYMENT.md#3-github-pages-部署) |
| Docker | [DEPLOYMENT.md#4-docker-部署](./DEPLOYMENT.md#4-docker-部署) |

### 环境变量快速参考

部署前需要配置以下关键环境变量：

| 变量名 | 描述 |
|--------|------|
| `DATABASE_URL` | 数据库连接字符串 |
| `NEXTAUTH_SECRET` | NextAuth加密密钥 |
| `NEXTAUTH_URL` | 应用完整URL |
| `R2_ENDPOINT` | Cloudflare R2端点 |
| `R2_ACCESS_KEY_ID` | R2访问密钥ID |
| `R2_SECRET_ACCESS_KEY` | R2秘密访问密钥 |
| `R2_BUCKET_NAME` | R2存储桶名称 |

完整的环境变量配置和生成方法请参考 [DEPLOYMENT.md#环境变量配置](./DEPLOYMENT.md#环境变量配置)。

### 故障排除

如果部署过程中遇到问题，请参考：
- [DEPLOYMENT.md#故障排除指南](./DEPLOYMENT.md#故障排除指南)

---

**享受使用AI绘图元数据管理系统！** 🚀