# 发布到 GitHub Pages

## 方案说明

当前目录是一个自包含的 VitePress 文档站。

仓库改为 Public 后，可以使用 GitHub Actions 自动构建并发布到 GitHub Pages。后续只需要把文档改动推送到 `main` 分支，Actions 会自动执行部署流程。

## 本地命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages 设置

1. 进入仓库 `Settings -> Pages`。
2. Source 选择 `GitHub Actions`。
3. 保存后，推送到 `main` 分支会自动触发部署。

发布地址：

```text
https://Zy15922994624.github.io/neePaaS-handbook/
```

## 日常发布流程

修改文档后执行：

```bash
npm run build
git add .
git commit -m "更新文档"
git push
```

推送完成后，进入仓库 `Actions` 页面查看 `Deploy VitePress site to GitHub Pages` 工作流。

## 仓库路径说明

当前 GitHub Pages 访问路径是：

```text
/neePaaS-handbook/
```

工作流里会通过 `BASE_PATH` 自动设置该路径：

```yaml
BASE_PATH: /${{ github.event.repository.name }}/
```

`.vitepress/config.mts` 会读取 `BASE_PATH`，确保静态资源路径在 GitHub Pages 子路径下正常加载。
