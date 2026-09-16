# 熊奇公司中转站

熊奇公司的统一品牌入口，连接服装、陶瓷与 AI 科技订阅三个独立业务站。

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 日常维护

- 三个业务板块的文案、能力和子站链接：`src/data/portals.ts`
- 公司名称、使命、口号和价值观：`src/data/company.ts`
- 颜色、布局和响应式样式：`src/styles.css`
- 品牌与产品图片：`public/assets/`

子站上线时，只需把对应板块的 `destination` 从 `null` 改成完整的 HTTPS 地址。按钮会自动从“独立网站筹备中”变成“进入独立网站”。

## Cloudflare 部署

当前生产环境是 Cloudflare Workers Static Assets，地址为
`https://xiongqi-hub.otafuku2599.workers.dev`。Pages 新建项目在当前账户返回
`Subdomain is blocked`，所以保留 Pages 配置作为后续可选方案，不影响当前网站上线。

```bash
npm ci
npm run deploy
```

`wrangler.worker.toml` 定义静态资源、`worker/index.ts` 定义入口和安全响应头，
`functions/api/inquiry.ts` 同时供 Workers 和未来 Pages 使用。Cloudflare D1 数据库
`xiongqi-hub` 已创建，绑定变量为 `DB`，表结构位于 `database/schema.sql`。

首次连接 GitHub 自动构建时，在 Cloudflare 控制台进入 Worker `xiongqi-hub` 的
Settings > Builds，连接 `icbearp/otafuku`，生产分支使用 `main`，
构建命令为 `npm run build`，部署命令为 `npx wrangler deploy --config wrangler.worker.toml`。
连接前先确认 GitHub App 的仓库访问范围仅包括本仓库。不要提交 API Token 或 `.dev.vars`。

若日后 Pages 账户限制解除，也可改用 `wrangler.toml` 和 `npm run deploy:pages`。

## 上线前必须替换

- 正式域名确定后补充站点地图并提交到搜索引擎站长平台。
- 页面中的临时邮箱说明。
- ICP 备案、公安备案、隐私政策和主体公示信息。
- 三个独立业务站的正式域名。
- 陶瓷板块的最终产品图、材质与工艺说明。

## 内容边界

当前版本不展示未经确认的价格、库存、销量、客户案例、认证或服务时效。AI 订阅板块在正式上线交易前，应补齐渠道来源、交付方式、退款规则、账号风险和售后责任说明。
