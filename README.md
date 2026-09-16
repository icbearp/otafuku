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

## Cloudflare Pages

推荐使用 GitHub 自动部署：

1. 把 `website/` 作为仓库根目录，或在 Cloudflare 的 Root directory 中填写 `website`。
2. Build command 填写 `npm run build`。
3. Build output directory 填写 `dist`。
4. Node.js 版本使用 22 或更高版本。

### 开启询盘接口

1. 在 Cloudflare 创建 D1 数据库 `xiongqi-hub`。
2. 执行 `database/schema.sql`。
3. 在 Pages 项目 Settings > Bindings 中添加 D1 binding，变量名必须为 `DB`。
4. 重新部署。

本地 Wrangler 开发可复制 `wrangler.example.toml` 为 `wrangler.toml`，填入真实数据库 ID。不要提交密钥或本地 `.dev.vars`。

## 上线前必须替换

- 正式域名确定后补充站点地图并提交到搜索引擎站长平台。
- 页面中的临时邮箱说明。
- ICP 备案、公安备案、隐私政策和主体公示信息。
- 三个独立业务站的正式域名。
- 陶瓷板块的最终产品图、材质与工艺说明。

## 内容边界

当前版本不展示未经确认的价格、库存、销量、客户案例、认证或服务时效。AI 订阅板块在正式上线交易前，应补齐渠道来源、交付方式、退款规则、账号风险和售后责任说明。
