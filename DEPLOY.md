# 发布到 GitHub Pages

## 方案说明

当前目录是一个自包含的 VitePress 文档站。把 `docs/neePaaS-handbook` 作为一个 GitHub 仓库推上去后，可以使用 GitHub Pages 自动发布。

## 本地命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages 设置

1. 在 GitHub 创建一个新仓库，例如 `neepaas-handbook`。
2. 将本目录内容推送到仓库根目录。
3. 进入仓库 `Settings -> Pages`。
4. Source 选择 `GitHub Actions`。
5. 推送到 `main` 分支后，Actions 会自动构建并发布。

## 仓库名不是根域名时

如果访问地址形如：

```text
https://用户名.github.io/neepaas-handbook/
```

需要在 GitHub Actions 里设置：

```yaml
BASE_PATH: /neepaas-handbook/
```

本项目的 `.vitepress/config.mts` 会读取 `BASE_PATH` 环境变量。
