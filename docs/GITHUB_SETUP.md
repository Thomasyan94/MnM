# 用 VS Code 上传 GitHub

## 第一次上传

1. 解压 `mnm-website-github-v2.zip`，用 VS Code 的 Open Folder 打开内层 `mnm-website` 文件夹；确认根目录有 README、AGENTS.md、package.json。
2. 在终端运行 `npm test`、`npm run check`、`npm run dev`，检查本地网站。
3. 左侧 Source Control → Initialize Repository。
4. 检查待提交清单：应包含 `src/`、`public/`、`experiments/`、文档和 `.github/`；不包含 `.env`、`dist/`、`node_modules/`。
5. 输入提交说明 `Prepare modular MnM drink website`，Commit。
6. 选择 Publish Branch / Publish to GitHub，用自己的账号完成上传，并选择仓库名称和可见性。

若接到已有仓库，先在本地创建独立分支，再复制本包内容并审查差异，不覆盖原 `.git`。

## GitHub Pages

仓库 Settings → Pages → Source 选择 GitHub Actions。工作流默认跟随 `main`；如果你的默认分支不同，修改 `.github/workflows/pages.yml` 的 branches。

工作流会先验证、再构建并发布 `dist/`。完成后在 Pages 或工作流部署结果中复制网址；不要猜用户名或仓库地址。

Github Pages 只托管静态文件，无法运行 PostgreSQL 或数据库 API。后端部署到你选择的服务器后，再配置 API 地址。不要因为换了托管平台，就删除模拟订单说明或加入真实付款。

## 后续给 Codex 的提示词

> 请先完整阅读 AGENTS.md、PROJECT_CONTEXT.md、docs/ARCHITECTURE.md，再检查当前代码和 git 状态。根据我接下来指定的任务修改。保留已确认的桌面与手机交互；所有订单仍为模拟。不要直接修改 dist，不要将实验效果擅自推广到所有饮品。完成后运行 npm test、npm run check、npm run build，并更新相关文档。
