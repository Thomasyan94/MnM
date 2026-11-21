# 架构与修改位置

## 数据流

页面操作由 controllers 更新 `store`；UI 读取当前选择并请求渲染；计价调用独立 domain 函数。目录经 repository 加载与验证，再通过 `catalog-runtime.js` 适配到现有 UI。模拟订单经 service 转换为稳定 ID 请求，由 repository 调用纯订单重算或未来 API。

| 层               | 可以依赖                           | 不应依赖               |
| ---------------- | ---------------------------------- | ---------------------- |
| domain           | 传入的目录与选择                   | DOM、fetch、SQL、store |
| repositories     | domain 校验、HTTP 客户端           | UI、DOM 渲染           |
| services         | repositories、数据适配             | HTML 生成              |
| controllers / UI | store、domain、services、renderers | 数据库凭证、SQL        |
| renderers        | 视觉配置、选择、三语格式           | 订单提交、数据库       |

## 改动示例

- 改布丁价格：`public/data/catalog.json` 的 `toppings[id=pudding].priceCents`。
- 限制某款饮品配料：该饮品的 `allowedToppingIds`；已包含项用 `includedToppingIds`。
- 改图片／分层位置：`src/config/visual-assets.js`、`src/renderers/`；不要在计价层放图片逻辑。
- 改手机版固定预览：`src/ui/mobile-preview.js` 与 `src/styles/mobile-preview.css`。
- 更换数据来源：`src/config/app-config.js` 与 repositories；API 输出契约保持不变。

## 兼容范围与限制

这是渐进重构，不是框架重写。UI 与 controller 存在部分相互调用，手机预览仍使用 MutationObserver 跟随现有画面变化。Domain 与 repositories 已隔离；下一轮若继续减少 UI 耦合，可引入订阅状态通知，不必重写计价与数据接口。

杯子视觉使用本地素材与独立图层，不是 3D 物理或真实液体模拟。推荐搭配、风味示意、摩卡的特殊素材仍由视觉配置维护。新增分类或新规格类型时，需要扩展 UI 约定；仅新增同类饮品数据可复用现有布局。

## 构建

Node 脚本将入口、ES modules、CSS、实验页和 public 资源复制为静态 `dist/`。不引入 bundler，降低交接依赖；图片路径保留相对路径，支持 GitHub Pages 仓库子目录。
