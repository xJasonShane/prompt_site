# AI绘图元数据管理网站

一个功能完整的AI绘图元数据管理系统,支持在Cloudflare Pages、Vercel、GitHub Pages等主流平台部署。

## 功能特性

- 📤 图片上传与存储 (支持Cloudflare R2)
- 📝 完整的元数据管理
  - 正向/负向提示词
  - AI模型信息 (名称、版本)
  - 生成参数 (步数、CFG、种子、采样器、尺寸)
  - LoRA模型管理
- 🖼️ 响应式图片展示 (瀑布流布局)
- 🔍 搜索与筛选功能
- 👤 用户认证系统 (NextAuth.js)
- 🌙 深色模式支持
- 📱 完全响应式设计

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI组件**: shadcn/ui (基于Radix UI)
- **样式方案**: Tailwind CSS
- **数据库**: SQLite + Drizzle ORM
- **对象存储**: Cloudflare R2 (S3兼容)
- **认证系统**: NextAuth.js v5
- **表单验证**: React Hook Form + Zod
- **语言**: TypeScript

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `.env.example` 为 `.env` 并配置以下变量:

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

### 数据库初始化

```bash
# 生成数据库迁移文件
npm run db:generate

# 应用迁移
npm run db:push
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署指南

### Cloudflare Pages

1. 构建项目:
```bash
npm run build
```

2. 使用Wrangler部署:
```bash
npx wrangler pages deploy .next
```

3. 在Cloudflare Dashboard配置环境变量

### Vercel

1. 推送代码到GitHub
2. 在Vercel导入项目
3. 配置环境变量
4. 自动部署

### GitHub Pages

1. 修改 `next.config.js`:
```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

2. 构建静态站点:
```bash
npm run build
```

3. 推送到GitHub,自动触发GitHub Actions部署

## 项目结构

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
│   └── ui/               # UI组件 (shadcn/ui)
├── lib/                  # 工具库
│   ├── auth.ts           # NextAuth配置
│   ├── db.ts             # 数据库连接
│   ├── schema.ts         # 数据库模型
│   ├── storage.ts        # R2存储配置
│   └── utils.ts          # 工具函数
├── drizzle.config.ts     # Drizzle配置
├── next.config.js        # Next.js配置
├── tailwind.config.ts    # Tailwind配置
└── package.json          # 项目依赖
```

## 数据库模型

### Users (用户表)
- id: 用户ID
- name: 用户名
- email: 邮箱
- password: 密码
- createdAt: 创建时间

### Images (图片表)
- id: 图片ID
- userId: 用户ID
- url: 图片URL
- filename: 文件名
- size: 文件大小
- width: 宽度
- height: 高度
- createdAt: 创建时间

### Metadata (元数据表)
- id: 元数据ID
- imageId: 图片ID
- positivePrompt: 正向提示词
- negativePrompt: 负向提示词
- model: AI模型
- version: 模型版本
- steps: 步数
- cfg: CFG Scale
- seed: 种子
- sampler: 采样器
- width: 生成宽度
- height: 生成高度
- createdAt: 创建时间

### Loras (LoRA模型表)
- id: LoRA ID
- metadataId: 元数据ID
- name: LoRA名称
- weight: 权重

## API接口

### POST /api/upload
上传图片并保存元数据

**请求体**:
- file: 图片文件
- positivePrompt: 正向提示词
- negativePrompt: 负向提示词
- model: AI模型
- version: 模型版本
- steps: 步数
- cfg: CFG Scale
- seed: 种子
- sampler: 采样器
- width: 宽度
- height: 高度
- loras: LoRA模型数组

### GET /api/gallery
获取图片列表

**查询参数**:
- page: 页码 (默认1)
- limit: 每页数量 (默认12)
- search: 搜索关键词
- model: 模型筛选

### GET /api/images/:id
获取图片详情

**返回**:
- 图片信息
- 元数据
- LoRA模型列表

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查

npm run db:generate  # 生成数据库迁移
npm run db:push      # 应用数据库更改
npm run db:studio    # 打开数据库管理界面
```

## 许可证

MIT License
