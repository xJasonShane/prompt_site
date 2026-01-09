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

- Node.js 18.17+ 或 Node.js 20.6+
- npm 9+ 或 yarn 1.x
- Git

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/your-username/prompt-site.git
cd prompt-site
```

1. **安装依赖**

```bash
npm install
# 或使用 yarn
yarn install
```

1. **配置环境变量**

复制 `.env.example` 为 `.env.local` 并配置以下变量：

```env
# Database
DATABASE_URL="file:./prompt_site.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudflare R2 Storage
R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="prompt-images"
```

> **生成NEXTAUTH_SECRET**：
>
> ```bash
> openssl rand -base64 32
> ```

1. **初始化数据库**

```bash
# 生成数据库迁移文件
npm run db:generate

# 应用数据库更改
npm run db:push
```

1. **启动开发服务器**

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 部署指南

### 1. Cloudflare Pages

#### 前置条件

- Cloudflare账号
- Cloudflare R2存储桶
- Wrangler CLI安装：`npm install -g wrangler`

#### 部署步骤

1. **登录Wrangler**

   ```bash
   wrangler login
   ```

2. **构建项目**

   ```bash
   npm run build
   ```

3. **部署到Cloudflare Pages**

   ```bash
   npx wrangler pages deploy .next
   ```

4. **配置环境变量**
   - 登录Cloudflare控制台
   - 导航到Pages项目
   - 点击"Settings" > "Environment Variables"
   - 添加所有必要的环境变量（参考 `.env.example`）

5. **配置R2绑定**
   - 在Pages项目设置中，导航到"Functions" > "R2 Bucket Bindings"
   - 添加绑定：名称设为`R2`，选择你的R2存储桶

### 2. Vercel

#### 前置条件

- GitHub/GitLab/Bitbucket仓库
- Cloudflare R2存储桶

#### 部署步骤

1. **推送代码到Git仓库**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **导入项目到Vercel**
   - 登录Vercel控制台
   - 点击"Add New" > "Project"
   - 选择你的Git仓库
   - 点击"Import"

3. **配置项目**
   - 框架预设：Next.js
   - 构建命令：默认（`npm run build`）
   - 输出目录：默认（`.next`）

4. **配置环境变量**
   - 在"Environment Variables"部分，添加所有必要的环境变量
   - 点击"Deploy"

5. **等待部署完成**
   - Vercel会自动构建并部署项目
   - 部署完成后，你将获得一个URL

### 3. GitHub Pages

#### 前置条件

- GitHub仓库
- Cloudflare R2存储桶

#### 部署步骤

1. **修改Next.js配置**
   编辑 `next.config.js`：

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
       unoptimized: true,
     },
     output: 'export',
   };
   
   module.exports = nextConfig;
   ```

2. **配置GitHub Actions**
   项目已包含 `.github/workflows/deploy.yml`，无需修改

3. **推送代码到GitHub**

   ```bash
   git push origin main
   ```

4. **配置GitHub Pages**
   - 登录GitHub，进入仓库设置
   - 导航到"Pages"
   - 来源选择："GitHub Actions"

5. **等待自动部署**
   - GitHub Actions会自动运行构建和部署
   - 部署完成后，访问 `https://your-username.github.io/prompt-site/`

### 4. Docker部署

#### 前置条件

- Docker和Docker Compose
- Cloudflare R2存储桶

#### 部署步骤

1. **创建Dockerfile**（如果不存在）

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **创建docker-compose.yml**

   ```yaml
   version: '3.8'
   
   services:
     app:
       build: .
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
         - ./prompt_site.db:/app/prompt_site.db
   ```

3. **构建并运行**

   ```bash
   docker-compose up -d
   ```

## 📁 项目结构

```
prompt_site/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── auth/          # 认证API
│   │   ├── upload/        # 图片上传API
│   │   ├── gallery/       # 图片列表API
│   │   └── images/        # 图片详情API
│   ├── gallery/           # 图片库页面
│   ├── images/            # 图片详情页面
│   ├── upload/            # 上传页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── ui/               # UI组件 (shadcn/ui)
│   ├── navbar.tsx        # 导航栏组件
│   ├── theme-toggle.tsx  # 主题切换组件
│   └── performance-monitor.tsx # 性能监控组件
├── lib/                  # 工具库
│   ├── auth.ts           # NextAuth配置
│   ├── db.ts             # 数据库连接
│   ├── schema.ts         # 数据库模型
│   ├── storage.ts        # R2存储配置
│   └── utils.ts          # 工具函数
├── .github/              # GitHub配置
│   └── workflows/        # CI/CD工作流
├── drizzle.config.ts     # Drizzle配置
├── next.config.js        # Next.js配置
├── tailwind.config.ts    # Tailwind配置
├── package.json          # 项目依赖
└── README.md             # 项目文档
```

## 🗄️ 数据库模型

### Users (用户表)

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | TEXT | 用户ID（主键） |
| name | TEXT | 用户名 |
| email | TEXT | 邮箱（唯一） |
| password | TEXT | 密码（加密存储） |
| createdAt | TIMESTAMP | 创建时间 |

### Images (图片表)

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | TEXT | 图片ID（主键） |
| userId | TEXT | 用户ID（外键） |
| url | TEXT | 图片URL |
| filename | TEXT | 文件名 |
| size | INTEGER | 文件大小（字节） |
| width | INTEGER | 图片宽度 |
| height | INTEGER | 图片高度 |
| createdAt | TIMESTAMP | 创建时间 |

### Metadata (元数据表)

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | TEXT | 元数据ID（主键） |
| imageId | TEXT | 图片ID（外键） |
| positivePrompt | TEXT | 正向提示词 |
| negativePrompt | TEXT | 负向提示词 |
| model | TEXT | AI模型名称 |
| version | TEXT | 模型版本 |
| steps | INTEGER | 生成步数 |
| cfg | INTEGER | CFG Scale |
| seed | INTEGER | 随机种子 |
| sampler | TEXT | 采样器 |
| width | INTEGER | 生成宽度 |
| height | INTEGER | 生成高度 |
| createdAt | TIMESTAMP | 创建时间 |

### Loras (LoRA模型表)

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | TEXT | LoRA ID（主键） |
| metadataId | TEXT | 元数据ID（外键） |
| name | TEXT | LoRA模型名称 |
| weight | INTEGER | 权重（百分比） |

## 📡 API接口

### POST /api/upload

**上传图片并保存元数据**

**请求体**：

- `file`: 图片文件（multipart/form-data）
- `positivePrompt`: 正向提示词
- `negativePrompt`: 负向提示词
- `model`: AI模型名称
- `version`: 模型版本
- `steps`: 生成步数
- `cfg`: CFG Scale
- `seed`: 随机种子
- `sampler`: 采样器
- `width`: 生成宽度
- `height`: 生成高度
- `loras`: LoRA模型数组（JSON字符串）

**响应**：

```json
{
  "success": true,
  "imageId": "uuid",
  "imageUrl": "https://example.com/image.jpg"
}
```

### GET /api/gallery

**获取图片列表**

**查询参数**：

- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：12，最大：24）
- `search`: 搜索关键词
- `model`: 模型筛选

**响应**：

```json
{
  "images": [
    {
      "id": "uuid",
      "url": "https://example.com/image.jpg",
      "positivePrompt": "beautiful landscape",
      "model": "Stable Diffusion XL",
      "steps": 20,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 12,
  "hasMore": true
}
```

### GET /api/images/:id

**获取图片详情**

**响应**：

```json
{
  "id": "uuid",
  "url": "https://example.com/image.jpg",
  "positivePrompt": "beautiful landscape",
  "negativePrompt": "ugly, blurry",
  "model": "Stable Diffusion XL",
  "version": "1.0",
  "steps": 20,
  "cfg": 7,
  "seed": 123456,
  "sampler": "DPM++ 2M Karras",
  "width": 1024,
  "height": 1024,
  "createdAt": "2024-01-01T00:00:00Z",
  "loras": [
    {
      "name": "nature",
      "weight": 70
    }
  ]
}
```

## 🛠️ 开发命令

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行代码检查 |
| `npm run typecheck` | 运行类型检查 |
| `npm run db:generate` | 生成数据库迁移文件 |
| `npm run db:migrate` | 运行数据库迁移 |
| `npm run db:push` | 直接推送数据库更改 |
| `npm run db:studio` | 打开Drizzle Studio数据库管理界面 |

## 📝 开发流程

1. **创建分支**：`git checkout -b feature/your-feature`
2. **开发功能**：编写代码并确保通过类型检查和lint
3. **提交代码**：`git add . && git commit -m "feat: add your feature"`
4. **推送分支**：`git push origin feature/your-feature`
5. **创建PR**：在GitHub上创建Pull Request
6. **等待CI检查**：确保所有测试通过
7. **代码审查**：等待团队成员审查
8. **合并PR**：审查通过后合并到main分支

## 🎨 设计规范

### 颜色方案

- 主色调：蓝色系（#3b82f6）
- 辅助色：紫色系（#8b5cf6）
- 中性色：灰色系
- 深色模式：深色背景（#111827）

### 组件规范

- 使用shadcn/ui组件库
- 遵循原子设计原则
- 组件命名使用PascalCase
- 文件命名使用kebab-case

## 🔧 CI/CD

项目使用GitHub Actions进行持续集成和部署：

- **CI测试**：在非main分支推送时运行
- **部署**：在main分支推送时自动部署
- **检查项**：
  - 依赖安装
  - 代码lint
  - 类型检查
  - 项目构建

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

请确保你的代码符合项目的设计规范和质量标准。

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如果您有任何问题或建议，请通过以下方式联系我们：

- 提交 [Issue](https://github.com/your-username/prompt-site/issues)
- 发送邮件到 <support@example.com>
- 加入我们的 Discord 社区

## 📈 项目状态

- ✅ 核心功能完成
- ✅ 部署文档完善
- ✅ CI/CD集成
- ✅ 单元测试（部分）
- ✅ 文档齐全

## 🌟 特别鸣谢

感谢所有为本项目做出贡献的开发者和支持者！

---

**享受使用AI绘图元数据管理系统！** 🎉
