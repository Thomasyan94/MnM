# API 契约 v1（后端尚未实现）

当前默认从本地 JSON 读取目录、在浏览器内生成模拟回执。API 模式是已实现的客户端适配器，服务器需另行开发。

## GET /api/catalog

返回与 `public/data/catalog.json` 完全相同的 envelope：`schemaVersion`、`currency`、`categories`、`sizes`、`milks`、`toppings`、`foams`、`drinks`。成功状态 200，Content-Type application/json。金额为 MYR 整数分；所有 name/story/ingredients 为 `{zh,en,ms}`。

服务端把数据库关系组装成该格式。ID 稳定；数组顺序决定同类饮品展示顺序。当前 UI 识别 milk-tea、coffee、matcha 三个分类，medium/large 杯型，original/oat/coconut/soy 奶类。

目录只允许纯文本，客户端校验暂时拒绝 `<`、`>`、双引号。未来需要支持这些字符时，先统一改模板输出转义。不要返回 HTML 富文本。

## POST /api/demo-orders

请求只包含选择与数量，不包含可信价格：

```json
{
  "pickupName": "Thomas",
  "items": [
    {
      "drinkId": "0-0",
      "quantity": 1,
      "selection": {
        "sizeId": "medium",
        "milkId": "original",
        "toppingIds": ["pudding"],
        "foamId": "none",
        "sugar": 50,
        "ice": 2
      }
    }
  ]
}
```

成功回执示例（200 或 201）：

```json
{
  "orderId": "MNM-DEMO1234",
  "currency": "MYR",
  "totalCents": 1390,
  "simulated": true
}
```

`orderId` 限定 1–80 个英文字母、数字或短横线。响应必须标记 simulated=true。前端拒绝未知币种、负数／非整数金额或非模拟回执。

服务端重新读取目录／价格，验证所选配料、已包含配料、数量与可用状态，在事务内计算与保存快照。不得信任购物袋里的 unit、total 等前端字段。失败返回 4xx/5xx；客户端会保留购物袋供重试。

未来持久化 API 还应实现请求幂等、认证／访问限制、限流和业务校验；本包不宣称已经实现这些服务器功能。跨域时后端配置精确允许的来源；浏览器当前不发送跨域账号凭证。
