<p align="center">
  <h1 align="center">Next Markdown Blog</h1>
</p>

<p align="center">
  一个基于 Next.js、Hono.js、Cloudflare Pages 和 Cloudflare D1 数据库构建的 Markdown 博客，支持类 MDX 风格的自定义 React 组件渲染。
</p>

## ✨ 特性
- ⚡️ 基于 Next.js 和 Hono.js，性能优秀、部署便捷。
- 📚 使用 Vditor 实现 Markdown 编辑，提供良好的书写体验。
- 🎯 支持渲染自定义 React 组件，类似 MDX 体验，内容更灵活。
- 💾 通过 Cloudflare D1 和 Drizzle ORM 实现数据库存储，高效可靠。
- 🎨 UI 采用 Tailwind CSS 和 Shadcn/ui，风格现代、易于定制。
- 🚀 使用 Cloudflare Pages 部署，全球访问快速稳定。

## 📦 技术栈
- 框架：Next.js、Hono.js
- 数据库：Cloudflare D1、Drizzle ORM
- Markdown 编辑器：Vditor
- UI 框架：Tailwind CSS、Shadcn/ui
- 部署平台：Cloudflare Pages

## 🚧 开发

1. 克隆仓库：
```bash
git clone https://github.com/sdrpsps/blog
cd next-blog
```

2. 安装依赖：
```bash
pnpm install
```

3. 修改配置文件
在 `wrangler.jsonc` 设置 Cloudflare D1 数据库名以及数据库 ID

4. 设置环境变量：
```bash
cp .env.example .env.local
```
设置 NEXT_PUBLIC_BASE_URL（博客地址）, AUTH_SECRET

5. 创建本地数据库表结构
```bash
pnpm db:migrate-local
```

6. 本地运行：
```bash
pnpm run dev
```

## 🌍 部署到 Cloudflare Pages

1. 执行 <a href="#🚧 开发">🚧 开发</a> 中的步骤 1~4

2. 部署
```bash
pnpm run deploy
```

## 💡 贡献

欢迎提交 Pull Request 或者 Issue 来帮助改进这个项目

## 📄 License

本项目采用 [MIT](LICENSE) 许可证
