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

### 环境变量配置

在部署前，请确保正确配置以下环境变量。所有必需变量都必须设置，否则应用将无法正常运行。

| 变量名 | 类型 | 描述 | 必需 | 示例值 | 最佳实践 |
|--------|------|------|------|--------|----------|
| `DATABASE_URL` | String | 数据库连接字符串 | ✅ | `file:./prompt_site.db` | 生产环境建议使用外部数据库服务 |
| `NEXTAUTH_SECRET` | String | NextAuth加密密钥，用于会话安全 | ✅ | `openssl rand -base64 32` | 使用强随机值，定期轮换 |
| `NEXTAUTH_URL` | String | 应用的完整URL，用于重定向 | ✅ | `https://your-app.example.com` | 生产环境必须使用HTTPS |
| `R2_ENDPOINT` | String | Cloudflare R2存储端点URL | ✅ | `https://your-account-id.r2.cloudflarestorage.com` | 确保使用正确的账户ID |
| `R2_ACCESS_KEY_ID` | String | R2访问密钥ID | ✅ | `AKIAIOSFODNN7EXAMPLE` | 遵循最小权限原则，只授予必要权限 |
| `R2_SECRET_ACCESS_KEY` | String | R2秘密访问密钥 | ✅ | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | 妥善保管，避免泄露 |
| `R2_BUCKET_NAME` | String | R2存储桶名称 | ✅ | `prompt-images` | 使用描述性名称，便于管理 |

### 环境变量生成工具

- **生成NEXTAUTH_SECRET**：
  ```bash
  # Linux/macOS
  openssl rand -base64 32
  
  # Windows PowerShell
  [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
  ```

### 安全建议

- 永远不要将环境变量提交到版本控制系统
- 生产环境中使用加密的方式存储敏感变量
- 定期轮换访问密钥和加密密钥
- 限制R2存储桶的访问权限，仅允许必要的IP和操作

### 1. Cloudflare Pages 部署

#### 1.1 前置条件
- ✅ Cloudflare账号（免费或付费均可）
- ✅ Cloudflare R2存储桶已创建并配置CORS策略
- ✅ Node.js 18.17+ 或 20.6+
- ✅ Wrangler CLI 已安装：`npm install -g wrangler`

#### 1.2 部署架构
```
┌────────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│ Git Repository     │────▶│ Cloudflare Pages │────▶│ Cloudflare R2     │
│                    │     │ (Edge Runtime)   │     │ Storage           │
└────────────────────┘     └──────────────────┘     └───────────────────┘
```

#### 1.3 部署步骤

1. **登录Wrangler CLI**
   ```bash
   wrangler login
   ```
   - 自动打开浏览器，登录您的Cloudflare账号
   - 授权Wrangler访问您的Cloudflare资源
   - 成功后，终端会显示登录成功消息

2. **构建生产版本**
   ```bash
   npm run build
   ```
   - 生成优化的生产代码
   - 输出目录：`.next`
   - 确保构建过程无错误

3. **部署到Cloudflare Pages**
   ```bash
   npx wrangler pages deploy .next
   ```
   - 部署`.next`目录到Cloudflare Pages
   - 部署完成后，获得临时预览URL
   - 示例输出：`✅ Deployment complete! https://your-project.pages.dev`

4. **配置环境变量**
   1. 登录 [Cloudflare控制台](https://dash.cloudflare.com/)
   2. 导航到 **Pages** > 选择您的项目
   3. 点击 **Settings** > **Environment Variables**
   4. 点击 **Add variable**
   5. 配置每个环境变量：
      - 输入变量名和值（参考环境变量表格）
      - 选择 **Encrypt** 选项加密敏感变量
      - 选择 **Production** 环境
      - 点击 **Save"
   6. 重复步骤4-5，添加所有必需的环境变量

5. **配置R2存储桶绑定**
   1. 在项目设置中，导航到 **Functions** > **R2 Bucket Bindings**
   2. 点击 **Add binding**
   3. 配置：
      - **Variable name**: `R2`（必须使用此名称，与代码中配置一致）
      - **Bucket name**: 选择您的R2存储桶
      - **Environment**: Production
   4. 点击 **Save"

6. **配置自定义域（推荐）**
   1. 导航到 **Custom domains**
   2. 点击 **Set up a custom domain**
   3. 输入您的域名（如 `ai-prompt.example.com`）
   4. 按照提示完成DNS配置
   5. 等待Cloudflare验证DNS记录（通常1-5分钟）

#### 1.4 验证部署

1. **基础验证**
   - 访问您的域名或Cloudflare提供的预览URL
   - 检查首页是否正常加载
   - 验证导航菜单是否可正常点击

2. **功能验证**
   - 点击"上传"按钮，进入上传页面
   - 填写表单并上传一张测试图片
   - 检查图片是否成功上传并显示在画廊中
   - 点击图片查看详情，确认元数据完整显示

3. **性能验证**
   - 检查页面加载时间（推荐使用Chrome DevTools）
   - 验证图片是否使用了适当的缓存策略
   - 检查控制台是否有错误信息

#### 1.5 最佳实践

- **启用自动部署**：配置Git仓库与Cloudflare Pages的自动关联，实现代码推送自动部署
- **配置构建前脚本**：添加依赖安装和数据库迁移等构建前步骤
- **设置回滚机制**：利用Cloudflare Pages的部署历史，在出现问题时快速回滚
- **监控性能**：使用Cloudflare Analytics监控网站流量和性能
- **启用边缘缓存**：配置适当的缓存策略，提高访问速度

#### 1.6 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 部署失败 | Wrangler版本过旧 | 运行 `wrangler upgrade` 更新到最新版本 |
| R2上传失败 | 存储桶绑定错误 | 检查R2绑定名称是否为 `R2`，存储桶是否存在 |
| 环境变量未生效 | 环境选择错误 | 确保环境变量已添加到 **Production** 环境 |
| 页面加载缓慢 | 资源未优化 | 检查图片大小，确保使用适当的压缩策略 |
| 构建错误 | 依赖版本冲突 | 删除 `node_modules` 和 `package-lock.json`，重新安装依赖 |

### 2. Vercel 部署

#### 2.1 前置条件
- ✅ GitHub/GitLab/Bitbucket仓库（项目已推送）
- ✅ Cloudflare R2存储桶已创建
- ✅ Vercel账号（可使用GitHub账号登录）
- ✅ 项目包含完整的`package.json`和`next.config.js`

#### 2.2 部署架构
```
┌────────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│ Git Repository     │────▶│ Vercel           │────▶│ Cloudflare R2     │
│                    │     │ (Serverless)     │     │ Storage           │
└────────────────────┘     └──────────────────┘     └───────────────────┘
```

#### 2.3 部署步骤

1. **准备Git仓库**
   ```bash
   # 确保所有更改已提交
   git add .
   git commit -m "feat: complete ai prompt site"
   git push origin main
   ```
   - 验证代码已成功推送到远程仓库
   - 确保`main`分支是默认分支

2. **导入项目到Vercel**
   1. 登录 [Vercel控制台](https://vercel.com/dashboard)
   2. 点击 **Add New** > **Project**
   3. 在"Import Git Repository"页面：
      - 选择您的Git提供商（GitHub/GitLab/Bitbucket）
      - 搜索并选择您的项目仓库
      - 点击 **Import"

3. **配置项目设置**
   1. **Framework Preset**：自动识别为"Next.js"（无需修改）
   2. **Root Directory**：保持默认（`.`）
   3. **Build and Output Settings**：
      - **Build Command**：`npm run build`（默认）
      - **Output Directory**：`.next`（默认）
      - **Install Command**：`npm install`（默认）
   4. 点击 **Continue**

4. **配置环境变量**
   1. 在"Environment Variables"部分，点击 **Add**
   2. 逐个添加所有必需的环境变量（参考环境变量表格）：
      - 例如：`DATABASE_URL`、`NEXTAUTH_SECRET`、`R2_ENDPOINT`等
   3. 对于敏感变量，确保值正确且不包含多余空格
   4. 点击 **Add** 保存每个变量
   5. 完成后，点击 **Deploy"

5. **等待部署完成**
   - Vercel会自动执行：依赖安装 → 构建 → 部署
   - 部署过程通常需要1-3分钟
   - 部署完成后，页面会显示"Deployment Complete"
   - 获得Vercel提供的URL：`https://your-project.vercel.app`

6. **配置自定义域（推荐）**
   1. 在Vercel项目中，导航到 **Settings** > **Domains**
   2. 点击 **Add**，输入您的自定义域名（如 `ai-prompt.example.com`）
   3. 按照Vercel的DNS配置指南完成设置：
      - 对于A记录：指向 `76.76.21.21`
      - 对于CNAME记录：指向 `cname.vercel-dns.com`
   4. 等待DNS记录生效（通常5-10分钟）
   5. Vercel会自动为您的域名配置SSL证书

#### 2.4 验证部署

1. **基础验证**
   - 访问您的Vercel URL（如 `https://your-project.vercel.app`）
   - 检查首页是否正常加载
   - 验证页面响应式设计（在不同设备尺寸下测试）

2. **功能验证**
   - 注册/登录功能
   - 图片上传功能（测试不同大小的图片）
   - 画廊浏览和搜索功能
   - 图片详情查看（包括元数据）
   - 深色/浅色模式切换

3. **性能验证**
   - 使用 [PageSpeed Insights](https://pagespeed.web.dev/) 测试性能
   - 检查API响应时间
   - 验证图片加载优化

#### 2.5 最佳实践

- **启用自动部署**：配置Vercel与Git仓库的自动关联，实现代码推送自动部署
- **配置部署预览**：为Pull Requests自动生成预览URL，便于代码审查
- **使用环境分支**：为不同环境（dev/staging/prod）配置独立的分支和环境变量
- **监控部署状态**：启用Vercel部署通知，及时了解部署结果
- **优化构建配置**：使用`vercel.json`自定义构建和部署行为

#### 2.6 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 构建失败：依赖安装错误 | package.json依赖版本冲突 | 删除`package-lock.json`，更新依赖版本 |
| 部署超时 | 构建时间过长 | 优化构建脚本，减少依赖数量 |
| 环境变量未生效 | 变量名拼写错误 | 检查变量名是否与代码中使用的一致 |
| R2访问被拒绝 | R2密钥配置错误 | 验证R2_ACCESS_KEY_ID和R2_SECRET_ACCESS_KEY |
| 图片无法显示 | 图片URL配置错误 | 检查R2_ENDPOINT和R2_BUCKET_NAME是否正确 |

#### 2.7 高级配置

**配置`vercel.json`**（可选，项目根目录）：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

### 3. GitHub Pages 部署

#### 3.1 前置条件
- ✅ GitHub仓库
- ✅ Cloudflare R2存储桶已创建
- ✅ 了解静态网站部署限制

#### 3.2 部署架构
```
┌────────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│ GitHub Repository  │────▶│ GitHub Actions   │────▶│ GitHub Pages      │
│                    │     │                  │     │                   │
└────────────────────┘     └──────────────────┘     └───────────────────┘
          ▲                                                │
          │                                                │
          └────────────────────────────────────────────────┘
```

#### 3.3 部署步骤

1. **配置静态导出**
   编辑 `next.config.js`，启用静态导出：
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: '**',
         },
       ],
       unoptimized: true, // GitHub Pages不支持Next.js图片优化
     },
     output: 'export', // 启用静态HTML导出
     basePath: '/prompt-site', // 替换为您的仓库名称
     trailingSlash: true, // 确保生成带有尾部斜杠的URL
   };
   
   module.exports = nextConfig;
   ```

2. **配置构建脚本**
   确保 `package.json` 中包含以下脚本：
   ```json
   {
     "scripts": {
       "build": "next build",
       "export": "next export",
       "deploy": "npm run build && npm run export"
     }
   }
   ```

3. **检查GitHub Actions工作流**
   项目已包含 `.github/workflows/deploy.yml`，内容如下：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
         - run: npm install
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: ./out
   
     deploy:
       needs: build
       permissions:
         pages: write
         id-token: write
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - uses: actions/deploy-pages@v4
   ```

4. **配置GitHub Pages**
   1. 登录GitHub，进入仓库设置
   2. 导航到 **Settings** > **Pages**
   3. **Source**：选择 "GitHub Actions"
   4. 点击 **Save"

5. **触发部署**
   ```bash
   git add .
   git commit -m "feat: configure github pages deployment"
   git push origin main
   ```
   - 推送代码后，GitHub Actions会自动运行部署工作流
   - 部署过程通常需要2-5分钟

#### 3.4 验证部署

- 部署完成后，访问 `https://your-username.github.io/prompt-site/`
- 检查静态页面是否正常加载
- 注意：GitHub Pages只支持静态网站，API路由不可用

#### 3.5 注意事项

- **静态网站限制**：GitHub Pages只支持静态HTML、CSS和JavaScript，不支持服务器端渲染
- **API路由不可用**：需要使用客户端数据获取和静态生成
- **自定义域名**：可以配置自定义域名，但需要手动管理DNS和SSL
- **访问速度**： GitHub Pages通过CDN分发，但速度可能不如Cloudflare或Vercel
- **存储限制**：仓库大小限制为1GB，GitHub Pages不适合存储大量大文件

### 4. Docker 部署

#### 4.1 前置条件
- ✅ Docker 20.10+ 和 Docker Compose 2.0+ 已安装
- ✅ Cloudflare R2存储桶已创建
- ✅ 服务器或本地环境有足够的资源

#### 4.2 部署架构
```
┌────────────────────┐     ┌──────────────────┐
│ Docker Host       │────▶│ Docker Container │
│                    │     │                  │
└────────────────────┘     └──────────────────┘
          │                          │
          │                          ▼
          │                  ┌───────────────────┐
          └──────────────────┘ Cloudflare R2     │
                            │ Storage           │
                            └───────────────────┘
```

#### 4.3 部署步骤

1. **Docker配置文件**
   
   - **Dockerfile**（项目根目录）：
     ```dockerfile
     # 使用Node.js 20 Alpine作为基础镜像
     FROM node:20-alpine AS builder
     
     # 设置工作目录
     WORKDIR /app
     
     # 复制依赖文件
     COPY package*.json ./
     
     # 安装依赖（生产环境）
     RUN npm ci --only=production
     
     # 复制项目文件
     COPY . .
     
     # 构建生产版本
     RUN npm run build
     
     # 生产环境镜像
     FROM node:20-alpine
     
     # 设置工作目录
     WORKDIR /app
     
     # 复制构建产物
     COPY --from=builder /app/.next ./.next
     COPY --from=builder /app/node_modules ./node_modules
     COPY --from=builder /app/package*.json ./
     COPY --from=builder /app/public ./public
     
     # 暴露端口
     EXPOSE 3000
     
     # 启动命令
     CMD ["npm", "start"]
     ```
   
   - **docker-compose.yml**（项目根目录）：
     ```yaml
     version: '3.8'
     
     services:
       app:
         build: .
         container_name: prompt-site
         restart: unless-stopped
         ports:
           - "3000:3000"
         environment:
           - NODE_ENV=production
           - DATABASE_URL=file:./prompt_site.db
           - NEXTAUTH_SECRET=your-secret-key-here
           - NEXTAUTH_URL=http://localhost:3000
           - R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
           - R2_ACCESS_KEY_ID=your-access-key-id
           - R2_SECRET_ACCESS_KEY=your-secret-access-key
           - R2_BUCKET_NAME=prompt-images
         volumes:
           # 持久化数据库文件
           - ./prompt_site.db:/app/prompt_site.db
           # 持久化上传的静态文件（如果有）
           - ./public/uploads:/app/public/uploads
     ```

2. **构建并启动容器**
   ```bash
   # 构建镜像并启动容器
   docker-compose up -d --build
   ```
   - `--build`：强制重新构建镜像
   - `-d`：后台运行容器

3. **查看容器状态**
   ```bash
   # 查看容器运行状态
   docker-compose ps
   
   # 查看容器日志
   docker-compose logs -f
   ```

4. **访问应用**
   - 本地部署：`http://localhost:3000`
   - 服务器部署：`http://your-server-ip:3000`

5. **更新部署**
   ```bash
   # 拉取最新代码
   git pull
   
   # 重新构建并启动容器
   docker-compose up -d --build
   ```

#### 4.4 验证部署

1. **容器状态**
   ```bash
   docker-compose ps
   ```
   - 确保容器状态为 `running`

2. **应用访问**
   - 访问 `http://localhost:3000`
   - 检查应用是否正常加载

3. **功能测试**
   - 测试核心功能：注册、登录、上传图片、浏览画廊
   - 验证数据持久化：重启容器后数据是否保留

#### 4.5 最佳实践

- **使用环境变量文件**：将敏感配置放入 `.env` 文件，而非硬编码到 `docker-compose.yml`
- **配置日志管理**：使用ELK Stack或其他日志管理工具收集容器日志
- **设置资源限制**：为容器配置CPU和内存限制，避免资源耗尽
- **定期备份**：定期备份数据库文件和重要数据
- **使用Docker Secrets**：生产环境中使用Docker Secrets管理敏感信息
- **自动化部署**：结合CI/CD工具实现自动化构建和部署

#### 4.6 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 容器无法启动 | 端口被占用 | 修改docker-compose.yml中的端口映射 |
| 数据库连接失败 | 权限问题 | 确保docker用户有读写数据库文件的权限 |
| 应用无法访问 | 防火墙阻止 | 检查服务器防火墙设置，开放端口3000 |
| 容器日志显示错误 | 环境变量配置错误 | 检查.env文件中的环境变量配置 |
| 图片上传失败 | 目录权限问题 | 确保上传目录有正确的写入权限 |

## 📊 部署平台对比

| 平台 | 免费额度 | 性能 | 易用性 | 功能完整性 | 适用场景 |
|------|----------|------|--------|------------|----------|
| Cloudflare Pages | 无限带宽，100,000次构建/月 | 优秀（边缘计算） | 中等 | 高 | 生产环境、高流量网站 |
| Vercel | 100GB带宽/月，12次构建/分钟 | 优秀 | 高 | 高 | 开发环境、中小型项目 |
| GitHub Pages | 无限带宽，1GB仓库大小 | 一般 | 低 | 低 | 演示网站、开源项目 |
| Docker | 无限制（取决于服务器资源） | 优秀 | 中等 | 高 | 私有部署、内部系统 |

## 🔍 故障排除指南

### 通用问题

1. **环境变量配置错误**
   - 检查变量名拼写是否正确
   - 确保敏感变量已加密存储
   - 验证变量值是否符合预期格式

2. **数据库连接问题**
   - 对于SQLite：确保数据库文件路径正确且有读写权限
   - 对于外部数据库：检查连接字符串和网络可达性

3. **R2存储问题**
   - 验证R2访问密钥和端点URL
   - 检查存储桶权限设置
   - 确保CORS策略配置正确

4. **构建失败**
   - 检查Node.js版本是否符合要求
   - 删除`node_modules`和`package-lock.json`，重新安装依赖
   - 检查构建脚本是否正确

5. **页面加载错误**
   - 检查浏览器控制台错误信息
   - 验证静态资源路径
   - 检查网络连接和CDN配置

### 平台特定问题

- **Cloudflare Pages**：检查Wrangler版本，确保R2绑定正确
- **Vercel**：检查构建日志，验证环境变量配置
- **GitHub Pages**：确保静态导出配置正确，API路由不可用
- **Docker**：检查容器日志，验证端口映射和卷挂载

## 📝 最佳实践总结

1. **安全性**
   - 永远不要将敏感信息提交到版本控制系统
   - 生产环境使用加密方式存储环境变量
   - 定期轮换访问密钥和加密密钥
   - 实施适当的访问控制和权限管理

2. **性能优化**
   - 使用CDN加速静态资源
   - 优化图片大小和格式
   - 实现缓存策略
   - 减少不必要的依赖

3. **可靠性**
   - 配置自动备份机制
   - 实施监控和告警系统
   - 建立回滚机制
   - 定期更新依赖和安全补丁

4. **可维护性**
   - 保持代码整洁和文档齐全
   - 使用CI/CD自动化构建和部署
   - 实施代码审查流程
   - 遵循一致的编码规范

5. **扩展性**
   - 设计模块化架构
   - 使用云原生服务
   - 考虑水平扩展方案
   - 避免单点故障

## 🎉 部署完成

恭喜您成功部署了AI绘图元数据管理系统！现在您可以：

- 邀请用户注册使用
- 上传和管理您的AI绘图作品
- 探索系统的各项功能
- 根据需要进行进一步的定制和扩展

如果您在使用过程中遇到任何问题，请参考故障排除指南或提交Issue。

---

**享受使用AI绘图元数据管理系统！** 🚀