# MnM · Mix n Match

饮品展示与模拟点单网站。30 款饮品，奶茶／咖啡／抹茶三类，中英马三语；保留手机固定预览、配料选择、实时价格、购物袋与模拟结账。

本包是 **GitHub 交接版 V2**：整理代码结构和数据边界，未重新设计饮品视觉。配料写实效果仍在实验中，未获最终确认。

## 本地运行

安装 Node.js 22 或更新的 LTS 版本，用 VS Code 打开本文件所在目录，然后在终端运行：

```bash
npm run dev
```

打开 `http://localhost:4173/`。本项目不需要安装第三方运行依赖，也无需数据库或 API key。不要双击 HTML 使用 `file://`，ES modules 和 JSON 需要 HTTP 服务。

```bash
npm test
npm run check
npm run build
```

构建结果输出到 `dist/`，它是生成目录，不直接编辑、不提交。独立配料实验位于 `/experiments/topping-test.html`。

## 文件职责

| 位置                          | 修改用途                                          |
| ----------------------------- | ------------------------------------------------- |
| `index.html`                  | 主页面结构与区块                                  |
| `public/data/catalog.json`    | 饮品、中英马文本、价格、允许配料、原配方包含项    |
| `public/assets/`              | 当前全部杯子／配料图片                            |
| `src/controllers/`            | 启动、事件绑定、选饮品与更新选择                  |
| `src/domain/`                 | 独立计价、选项验证、订单重算；不依赖 DOM 或 fetch |
| `src/repositories/`           | JSON/API 的数据读写边界                           |
| `src/services/`               | 把购物袋选择转换成订单请求                        |
| `src/data/catalog-runtime.js` | 新数据格式与现有展示组件之间的适配层              |
| `src/ui/`                     | 菜单、选项、购物袋、反馈、手机固定预览            |
| `src/renderers/`              | 通用杯子、摩卡、目录饮品等渲染                    |
| `src/config/visual-assets.js` | 素材映射、视觉参数、推荐搭配与风味示意            |
| `src/config/app-config.js`    | 公共前端配置，切换本地/API 模式                   |
| `src/i18n/`                   | 页面文案及语言选择                                |
| `src/styles/`                 | 基础、摩卡、目录、手机预览等分组样式              |
| `experiments/`                | 可独立回退的配料实验，不默认替换主网站            |
| `database/`                   | PostgreSQL 建表与种子数据草案，尚未连接或执行     |
| `docs/`                       | 项目架构、API 接入、验证结果、GitHub 操作说明     |

## 上传 GitHub

按 [GitHub 上传说明](docs/GITHUB_SETUP.md) 在 VS Code 提交并推送。包内没有你的 GitHub 地址、账号或凭证，因此这不是已上传的仓库。

GitHub Pages 工作流在 `.github/workflows/pages.yml`；开启 Pages 时选择 GitHub Actions。静态页面可以使用本地 JSON 和模拟订单；连接数据库需要另外部署后端 API。

## 后续接数据库

已提供数据仓库接口和稳定 ID，价格统一用 MYR 整数分，例如 `1190` 表示 RM11.90。后端可沿用 [API 契约](docs/API_CONTRACT.md) 返回目录。

接入步骤见 [数据库路线](docs/DATABASE_PLAN.md)。当前 API 模式只有客户端适配器，**没有已运行的服务器、数据库、登录系统或真实支付**。

## 开发前先读

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `docs/ARCHITECTURE.md`

此次交接保留现有视觉；不要把配料实验素材误认为已确认的最终成品。
