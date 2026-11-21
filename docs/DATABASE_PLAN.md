# 数据库接入路线

本包已准备 PostgreSQL 结构草案和与当前 JSON 一致的 seed；没有连接数据库，也没有执行这些 SQL。

## 关系

| 表               | 用途                                                     |
| ---------------- | -------------------------------------------------------- |
| categories       | 分类、三语名称与排序                                     |
| options          | 杯型、奶类、配料、奶盖的三语名称、整数分价格与扩展元数据 |
| drinks           | 稳定饮品 ID、分类、三语资料、基价、原配方奶泡与排序      |
| drink_options    | 每款允许／已包含的 topping、foam 关联                    |
| demo_orders      | 仅模拟订单的回执、总额与取餐称呼                         |
| demo_order_items | 数量、配方与当时价格／名称快照                           |

options 使用 `(kind,id)` 复合主键，避免 topping:taro 和 foam:taro 混淆。订单必须保存当时快照，不能让改菜单价追溯修改旧订单。

## 实现顺序

1. 在独立测试数据库审查、执行 `database/schema.sql` 和 `database/seed.sql`，不要直接在既有生产库执行。
2. 部署后端；服务端从数据库读数据，将关系映射成 API_CONTRACT 的目录 JSON。
3. 实现模拟订单接口，在服务端校验与重新计价，在事务中写订单和明细。
4. 在 `src/config/app-config.js` 将 catalogSource 改为 api；配置 apiBaseUrl。先验证目录，再切换 orderSource。
5. 验证错误、超时、并发价格变化、幂等和权限，确保没有真实收费或真实履单。

前端不能直接拿 PostgreSQL 连接字符串访问数据库。若未来用 Supabase，也需明确 RLS、匿名目录读取范围与订单写入策略；服务端密钥只放后端环境变量。

## 不在本次交接里

后端托管、数据库实例、迁移执行、账号与权限、库存、优惠券、税费、配送及支付。表结构是启动草案，不是已部署的生产系统。

修改目录 JSON 后，运行 `npm run db:seed:generate` 可重新生成 seed.sql；这个命令只写本地 SQL 文件，不连接或修改数据库。seed 使用 ON CONFLICT DO NOTHING，适合新库初始化，不能用来覆盖既有价格；已有数据更新需另写审核过的迁移。
