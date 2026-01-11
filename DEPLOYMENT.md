# 部署指南

本指南提供了将AI绘图元数据管理系统部署到各种平台的详细步骤和最佳实践。

## 📋 文档结构

- [环境变量配置](#环境变量配置)
- [部署选项](#部署选项)
  - [Cloudflare Pages](#1-cloudflare-pages-部署)
  - [Vercel](#2-vercel-部署)
  - [GitHub Pages](#3-github-pages-部署)
  - [Docker](#4-docker-部署)
- [部署平台对比](#部署平台对比)
- [故障排除指南](#故障排除指南)
- [最佳实践](#最佳实践)

## 🎯 部署目标

通过本指南，您将能够：
- ✅ 配置必要的环境变量
- ✅ 选择适合您需求的部署平台
- ✅ 按照详细步骤完成部署
- ✅ 验证部署结果
- ✅ 解决常见部署问题

## 📋 环境变量配置

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

## 🚀 部署选项

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

##### 1.3.1 登录Wrangler CLI
```bash
wrangler login
```
- 自动打开浏览器，登录您的Cloudflare账号
- 授权Wrangler访问您的Cloudflare资源
- 成功后，终端会显示登录成功消息

##### 1.3.2 构建生产版本
```bash
npm run build
```
- 生成优化的生产代码
- 输出目录：`.next`
- 确保构建过程无错误

##### 1.3.3 部署到Cloudflare Pages
```bash
npx wrangler pages deploy .next
```
- 部署`.next`目录到Cloudflare Pages
- 部署完成后，获得临时预览URL
- 示例输出：`✅ Deployment complete! https://your-project.pages.dev`

##### 1.3.4 配置环境变量
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

##### 1.3.5 配置R2存储桶绑定
1. 在项目设置中，导航到 **Functions** > **R2 Bucket Bindings**
2. 点击 **Add binding**
3. 配置：
   - **Variable name**: `R2`（必须使用此名称，与代码中配置一致）
   - **Bucket name**: 选择您的R2存储桶
   - **Environment**: Production
4. 点击 **Save"

##### 1.3.6 配置自定义域（推荐）
1. 导航到 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入您的域名（如 `ai-prompt.example.com`）
4. 按照提示完成DNS配置
5. 等待Cloudflare验证DNS记录（通常1-5分钟）

#### 1.4 验证部署

##### 1.4.1 基础验证
- ✅ 访问您的域名或Cloudflare提供的预览URL
- ✅ 检查首页是否正常加载
- ✅ 验证导航菜单是否可正常点击

##### 1.4.2 功能验证
- ✅ 点击"上传"按钮，进入上传页面
- ✅ 填写表单并上传一张测试图片
- ✅ 检查图片是否成功上传并显示在画廊中
- ✅ 点击图片查看详情，确认元数据完整显示

##### 1.4.3 性能验证
- ✅ 检查页面加载时间（推荐使用Chrome DevTools）
- ✅ 验证图片是否使用了适当的缓存策略
- ✅ 检查控制台是否有错误信息

#### 1.5 最佳实践

- ✅ **启用自动部署**：配置Git仓库与Cloudflare Pages的自动关联，实现代码推送自动部署
- ✅ **配置构建前脚本**：添加依赖安装和数据库迁移等构建前步骤
- ✅ **设置回滚机制**：利用Cloudflare Pages的部署历史，在出现问题时快速回滚
- ✅ **监控性能**：使用Cloudflare Analytics监控网站流量和性能
- ✅ **启用边缘缓存**：配置适当的缓存策略，提高访问速度
- ✅ **配置自定义域**：使用自己的域名提高品牌识别度
- ✅ **定期备份**：定期备份数据库和重要数据

#### 1.6 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 部署失败 | Wrangler版本过旧 | 运行 `wrangler upgrade` 更新到最新版本 |
| R2上传失败 | 存储桶绑定错误 | 检查R2绑定名称是否为 `R2`，存储桶是否存在 |
| 环境变量未生效 | 环境选择错误 | 确保环境变量已添加到 **Production** 环境 |
| 页面加载缓慢 | 资源未优化 | 检查图片大小，确保使用适当的压缩策略 |
| 构建错误 | 依赖版本冲突 | 删除 `node_modules` 和 `package-lock.json`，重新安装依赖 |
| 自定义域无法访问 | DNS配置错误 | 检查DNS记录是否正确配置，等待DNS生效 |

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

##### 2.3.1 准备Git仓库
```bash
# 确保所有更改已提交
git add .
git commit -m "feat: complete ai prompt site"
git push origin main
```
- 验证代码已成功推送到远程仓库
- 确保`main`分支是默认分支

##### 2.3.2 导入项目到Vercel
1. 登录 [Vercel控制台](https://vercel.com/dashboard)
2. 点击 **Add New** > **Project**
3. 在"Import Git Repository"页面：
   - 选择您的Git提供商（GitHub/GitLab/Bitbucket）
   - 搜索并选择您的项目仓库
   - 点击 **Import"

##### 2.3.3 配置项目设置
1. **Framework Preset**：自动识别为"Next.js"（无需修改）
2. **Root Directory**：保持默认（`.`）
3. **Build and Output Settings**：
   - **Build Command**：`npm run build`（默认）
   - **Output Directory**：`.next`（默认）
   - **Install Command**：`npm install`（默认）
4. 点击 **Continue**

##### 2.3.4 配置环境变量
1. 在"Environment Variables"部分，点击 **Add**
2. 逐个添加所有必需的环境变量（参考环境变量表格）：
   - 例如：`DATABASE_URL`、`NEXTAUTH_SECRET`、`R2_ENDPOINT`等
3. 对于敏感变量，确保值正确且不包含多余空格
4. 点击 **Add** 保存每个变量
5. 完成后，点击 **Deploy"

##### 2.3.5 等待部署完成
- Vercel会自动执行：依赖安装 → 构建 → 部署
- 部署过程通常需要1-3分钟
- 部署完成后，页面会显示"Deployment Complete"
- 获得Vercel提供的URL：`https://your-project.vercel.app`

##### 2.3.6 配置自定义域（推荐）
1. 在Vercel项目中，导航到 **Settings** > **Domains**
2. 点击 **Add**，输入您的自定义域名（如 `ai-prompt.example.com`）
3. 按照Vercel的DNS配置指南完成设置：
   - 对于A记录：指向 `76.76.21.21`
   - 对于CNAME记录：指向 `cname.vercel-dns.com`
4. 等待DNS记录生效（通常5-10分钟）
5. Vercel会自动为您的域名配置SSL证书

#### 2.4 验证部署

##### 2.4.1 基础验证
- ✅ 访问您的Vercel URL（如 `https://your-project.vercel.app`）
- ✅ 检查首页是否正常加载
- ✅ 验证页面响应式设计（在不同设备尺寸下测试）

##### 2.4.2 功能验证
- ✅ 注册/登录功能
- ✅ 图片上传功能（测试不同大小的图片）
- ✅ 画廊浏览和搜索功能
- ✅ 图片详情查看（包括元数据）
- ✅ 深色/浅色模式切换

##### 2.4.3 性能验证
- ✅ 使用 [PageSpeed Insights](https://pagespeed.web.dev/) 测试性能
- ✅ 检查API响应时间
- ✅ 验证图片加载优化

#### 2.5 最佳实践

- ✅ **启用自动部署**：配置Vercel与Git仓库的自动关联，实现代码推送自动部署
- ✅ **配置部署预览**：为Pull Requests自动生成预览URL，便于代码审查
- ✅ **使用环境分支**：为不同环境（dev/staging/prod）配置独立的分支和环境变量
- ✅ **监控部署状态**：启用Vercel部署通知，及时了解部署结果
- ✅ **优化构建配置**：使用`vercel.json`自定义构建和部署行为
- ✅ **配置自定义域**：使用自己的域名提高品牌识别度
- ✅ **启用监控**：使用Vercel Analytics监控网站性能和访问量

#### 2.6 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 构建失败：依赖安装错误 | package.json依赖版本冲突 | 删除`package-lock.json`，更新依赖版本 |
| 部署超时 | 构建时间过长 | 优化构建脚本，减少依赖数量 |
| 环境变量未生效 | 变量名拼写错误 | 检查变量名是否与代码中使用的一致 |
| R2访问被拒绝 | R2密钥配置错误 | 验证R2_ACCESS_KEY_ID和R2_SECRET_ACCESS_KEY |
| 图片无法显示 | 图片URL配置错误 | 检查R2_ENDPOINT和R2_BUCKET_NAME是否正确 |
| 自定义域SSL错误 | DNS配置错误 | 检查DNS记录是否正确，等待SSL证书生成 |

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

6. **等待GitHub Actions完成**
   - 进入GitHub仓库，点击 **Actions** 标签页
   - 查看部署工作流的运行状态
   - 部署成功后，会显示绿色的对勾图标

7. **访问部署网站**
   - 部署成功后，访问 `https://<your-username>.github.io/<your-repo-name>/`
   - 例如：`https://example.github.io/prompt-site/`

#### 3.4 验证部署

##### 3.4.1 基础验证
- ✅ 访问GitHub Pages URL，检查首页是否正常加载
- ✅ 验证导航菜单是否可正常点击
- ✅ 检查页面是否响应式

##### 3.4.2 功能限制说明
- ⚠️ **注意**：GitHub Pages是静态网站托管服务，不支持服务器端渲染和API路由
- ⚠️ 部分动态功能（如数据库操作、文件上传）可能无法正常工作
- ⚠️ 推荐仅用于展示和预览目的

#### 3.5 最佳实践

- ✅ **使用独立分支**：为GitHub Pages部署创建独立分支（如`gh-pages`）
- ✅ **优化静态资源**：确保所有图片和资源已压缩和优化
- ✅ **配置自定义域**：为GitHub Pages配置自定义域，提高访问体验
- ✅ **定期更新部署**：当代码有重大变更时，重新触发部署
- ✅ **检查构建日志**：定期查看GitHub Actions构建日志，确保部署正常

#### 3.6 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 部署失败 | 构建脚本错误 | 检查GitHub Actions日志，修复构建脚本 |
| 页面404错误 | 路由配置错误 | 确保`next.config.js`中`trailingSlash: true`已配置 |
| 图片无法显示 | 图片路径错误 | 检查图片引用路径，确保使用相对路径或完整URL |
| 样式丢失 | CSS构建错误 | 检查构建日志，确保CSS正确编译 |
| 自定义域无法访问 | DNS配置错误 | 检查CNAME记录是否正确配置 |

### 4. Docker 部署

#### 4.1 前置条件
- ✅ Docker已安装（推荐Docker Desktop 4.0+）
- ✅ Docker Compose已安装（可选，用于多容器部署）
- ✅ Cloudflare R2存储桶已创建
- ✅ 项目代码已克隆到本地

#### 4.2 部署架构
```
┌────────────────────┐     ┌──────────────────┐     ┌───────────────────┐
│ Docker Build       │────▶│ Docker Container │────▶│ Cloudflare R2     │
│                    │     │ (Next.js App)    │     │ Storage           │
└────────────────────┘     └──────────────────┘     └───────────────────┘
```

#### 4.3 部署步骤

##### 4.3.1 检查Docker配置文件

项目根目录已包含 `Dockerfile` 和 `docker-compose.yml` 文件：

**`Dockerfile`**：
```dockerfile
# 使用官方Node.js 20镜像作为基础
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 构建生产版本
RUN npm run build

# 使用轻量级镜像运行应用
FROM node:20-alpine AS runner

# 设置工作目录
WORKDIR /app

# 复制必要文件
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# 安装生产依赖
RUN npm ci --only=production

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

**`docker-compose.yml`**（可选）：
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      # 添加其他环境变量
      - DATABASE_URL=file:./prompt_site.db
      # 注意：在生产环境中，建议使用外部数据库服务
    volumes:
      - .:/app
      - /app/node_modules
    restart: unless-stopped
```

##### 4.3.2 构建Docker镜像

```bash
# 构建Docker镜像
docker build -t prompt-site .
```

##### 4.3.3 运行Docker容器

**方式1：使用docker run命令**

```bash
docker run -d \
  --name prompt-site \
  -p 3000:3000 \
  -e DATABASE_URL="file:./prompt_site.db" \
  -e NEXTAUTH_SECRET="<your-secret>" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -e R2_ENDPOINT="<your-r2-endpoint>" \
  -e R2_ACCESS_KEY_ID="<your-access-key>" \
  -e R2_SECRET_ACCESS_KEY="<your-secret-key>" \
  -e R2_BUCKET_NAME="<your-bucket-name>" \
  prompt-site
```

**方式2：使用Docker Compose**

```bash
# 编辑docker-compose.yml，添加必要的环境变量
# 然后运行以下命令
docker-compose up -d
```

##### 4.3.4 访问部署网站

部署成功后，访问 `http://localhost:3000`

#### 4.4 验证部署

##### 4.4.1 基础验证
- ✅ 访问 `http://localhost:3000`，检查首页是否正常加载
- ✅ 验证导航菜单是否可正常点击
- ✅ 检查控制台是否有错误信息

##### 4.4.2 功能验证
- ✅ 图片上传功能
- ✅ 画廊浏览功能
- ✅ 图片详情查看
- ✅ 深色/浅色模式切换

##### 4.4.3 性能验证
- ✅ 检查页面加载时间
- ✅ 验证图片是否优化
- ✅ 检查容器资源使用情况

#### 4.5 最佳实践

- ✅ **使用环境变量**：所有敏感配置通过环境变量传递，避免硬编码
- ✅ **使用卷挂载**：将数据库文件挂载到宿主机，便于备份和管理
- ✅ **配置健康检查**：为Docker容器添加健康检查，确保应用正常运行
- ✅ **使用Docker网络**：为容器配置专用网络，提高安全性
- ✅ **定期更新镜像**：定期更新基础镜像和依赖，修复安全漏洞
- ✅ **监控容器**：使用Docker监控工具（如Portainer）监控容器运行状态

#### 4.6 故障排除

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 容器启动失败 | 环境变量配置错误 | 检查环境变量是否正确设置 |
| 端口占用 | 端口3000已被其他应用占用 | 修改端口映射，例如：`-p 3001:3000` |
| 数据库文件权限错误 | 容器内用户没有写权限 | 调整卷挂载权限，或使用root用户运行容器 |
| 镜像构建失败 | 依赖安装错误 | 检查package.json，更新依赖版本 |
| 容器重启频繁 | 应用崩溃 | 查看容器日志：`docker logs prompt-site` |

#### 4.7 高级配置

**使用Nginx作为反向代理**（可选）：

```nginx
server {
    listen 80;
    server_name ai-prompt.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**配置HTTPS**：
- 使用Let's Encrypt获取SSL证书
- 配置Nginx支持HTTPS
- 在Next.js配置中启用HTTPS

## 📊 部署平台对比

| 平台 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **Cloudflare Pages** | - 边缘部署，访问速度快<br>- 与Cloudflare R2集成良好<br>- 免费计划包含多种功能<br>- 自动HTTPS | - 部分Next.js功能可能受限<br>- 自定义配置选项较少 | - 追求极致性能<br>- 已使用Cloudflare生态<br>- 小型到中型应用 |
| **Vercel** | - 官方Next.js支持<br>- 自动部署和预览<br>- 丰富的集成和插件<br>- 开发者友好的控制台 | - 免费计划有限制<br>- 高流量应用成本较高 | - 快速原型开发<br>- 依赖Next.js高级功能<br>- 团队协作开发 |
| **GitHub Pages** | - 免费托管<br>- 与GitHub无缝集成<br>- 适合静态网站 | - 不支持动态功能<br>- 构建时间限制<br>- 性能相对较差 | - 项目展示和预览<br>- 静态网站<br>- 开源项目文档 |
| **Docker** | - 完全可控的部署环境<br>- 支持任何平台<br>- 易于扩展和迁移<br>- 适合复杂应用架构 | - 需要额外的服务器资源<br>- 配置和管理复杂<br>- 部署流程较长 | - 企业级应用<br>- 需要自定义环境<br>- 多容器架构 |

## 🛠️ 故障排除指南

### 通用故障排除步骤

1. **检查日志**
   - Cloudflare Pages：查看部署日志和函数日志
   - Vercel：查看构建日志和运行时日志
   - GitHub Pages：查看GitHub Actions日志
   - Docker：使用`docker logs <container-name>`查看容器日志

2. **验证环境变量**
   - 确保所有必需的环境变量已正确设置
   - 检查变量名是否拼写错误
   - 验证敏感变量是否已加密

3. **检查依赖版本**
   - 确保Node.js版本符合要求（18.17+ 或 20.6+）
   - 检查依赖是否存在冲突
   - 尝试重新安装依赖

4. **验证R2存储配置**
   - 检查R2端点URL是否正确
   - 验证访问密钥和秘密密钥是否有效
   - 确保存储桶已正确配置CORS策略

5. **检查网络连接**
   - 验证服务器是否可以访问外部服务
   - 检查防火墙设置是否阻止了必要的端口

### 常见错误及解决方案

| 错误类型 | 可能原因 | 解决方案 |
|----------|----------|----------|
| **构建错误** | 依赖版本冲突、构建脚本错误 | 删除`node_modules`和`package-lock.json`，重新安装依赖 |
| **运行时错误** | 环境变量缺失、配置错误 | 检查环境变量配置，查看运行时日志 |
| **R2上传失败** | 存储桶配置错误、CORS策略问题 | 检查R2存储桶CORS配置，确保允许跨域请求 |
| **数据库连接错误** | 数据库URL错误、权限问题 | 验证数据库连接字符串，检查数据库权限 |
| **认证失败** | NEXTAUTH_SECRET错误、NEXTAUTH_URL配置错误 | 重新生成NEXTAUTH_SECRET，确保NEXTAUTH_URL与实际URL一致 |

## 📝 最佳实践

### 部署前检查清单

- ✅ 所有环境变量已正确配置
- ✅ 依赖已更新到最新稳定版本
- ✅ 代码已通过所有测试
- ✅ 静态资源已优化（图片压缩、代码分割）
- ✅ 数据库已备份
- ✅ 已配置监控和日志系统

### 部署后检查清单

- ✅ 网站可以正常访问
- ✅ 所有核心功能正常工作
- ✅ 性能符合预期
- ✅ 安全配置正确
- ✅ 监控系统已启用

### 日常维护建议

- **定期更新**：每月更新依赖和框架版本
- **性能监控**：使用工具监控网站性能，及时优化
- **安全审计**：定期进行安全审计，修复漏洞
- **备份数据**：定期备份数据库和重要文件
- **日志分析**：定期分析日志，发现潜在问题
- **容量规划**：根据流量增长情况，提前规划扩容

## 📄 许可证

本部署指南与AI绘图元数据管理系统遵循相同的许可证：
- **MIT License**
- 详见项目根目录的`LICENSE`文件

## 🤝 贡献

如果您发现本指南中的错误或有改进建议，欢迎：
- 创建Issue
- 提交Pull Request
- 联系项目维护者

---

**文档版本**：1.0.0  
**最后更新**：2026-01-11  
**维护者**：AI绘图元数据管理系统团队