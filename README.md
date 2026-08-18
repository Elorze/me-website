# me-website

个人站点（Vite + React + Tailwind）。默认可部署到 Vercel。

## 开发

```bash
npm install
npm run dev
```

本地地址：`http://localhost:311`

## 目录

```
src/
  app/           # 入口与 App 壳
  pages/         # 页面（先只有首页）
  components/    # UI 组件（按功能分子目录）
    hero/        # 首页沉浸场景
  content/       # 文案 / 资源注册（后期改内容优先看这里）
  lib/hooks/     # 可复用 hooks
  assets/images/ # 静态图片
  styles/        # 全局样式与动效 token
```

## 构建

```bash
npm run build
npm run preview
```
