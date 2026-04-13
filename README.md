# AI House Mini Program

智小窝找房微信小程序前端项目（原生小程序 + TypeScript）。

当前版本已完成租客主链路：
- 找房页（公开检索 + 高级筛选）
- 咨询页（客服对话 + 推荐房源卡）
- 个人页（租客端 MVP）
- 房源详情页（公开搜索结果兜底详情）

并已接入：
- 微信静默登录（`wx.login -> /api/v1/auth/wechat_login`）
- 统一请求封装（POST + Token 注入 + 错误拦截）
- 公开房源搜索 `/api/v1/house/search`
- 聊天接口 `/api/v1/chat/send`

## 技术栈

- 微信小程序原生开发
- TypeScript
- WXML
- WXSS
- glass-easel 组件框架

## 目录结构

```text
.
├── docs/
│   ├── ai-house-miniapp-design.md
│   ├── db_house_v5_proposal.md
│   ├── db_full_v2_design.md
│   └── profile_dual_mode_design.md
├── miniprogram/
│   ├── app.json
│   ├── app.ts
│   ├── app.wxss
│   ├── pages/
│   │   ├── discover/
│   │   ├── ai/
│   │   ├── profile/
│   │   ├── login/
│   │   └── house-detail/
│   ├── services/
│   │   ├── chat.ts
│   │   ├── house.ts
│   │   └── user.ts
│   ├── api/
│   └── utils/
├── typings/
├── package.json
├── project.config.json
└── tsconfig.json
```

## 页面说明

### 找房页（discover）

路径：`miniprogram/pages/discover/discover`

当前包含：

- 品牌头图
- 公开找房搜索
- 快捷需求（近地铁/押一付一/可养宠物等）
- 更多筛选（区域、租住方式、居室、付款方式、价格区间、开关条件）
- 公开房源列表（仅在主动搜索后展示）
- 推荐房源区与咨询跳转

### 咨询页（ai）

路径：`miniprogram/pages/ai/ai`

当前包含：
- 客服消息流
- 常见需求快捷卡
- 跟进追问 chips
- 内联房源推荐卡（2列）

### 我的页（profile）

路径：`miniprogram/pages/profile/profile`

当前为租客端 MVP：
- 个人中心登录入口（独立登录页）
- 租客统计卡（收藏/浏览/咨询会话）
- 常用入口（收藏、浏览、咨询、继续找房）
- 房东模式入口占位（后续接入）

### 登录页（login）

路径：`miniprogram/pages/login/login`

说明：
- 从个人页点击“登录个人中心”进入
- 用户确认后执行微信登录并返回个人页
- 与全局静默登录区分：用于“个人中心权限确认”

### 房源详情页（house-detail）

路径：`miniprogram/pages/house-detail/house-detail`

当前通过公开搜索结果做详情兜底：
- 先命中前端缓存
- 缓存未命中时分页回查 `/api/v1/house/search`

## 接口与服务层

### 请求封装

- 文件：`miniprogram/utils/request.ts`
- 特性：
  - 强制 POST
  - 自动拼接 `/api/v1`
  - 自动注入 `Authorization: Bearer <token>`
  - 统一处理 HTTP 和业务错误（Toast）

### 服务层

- `services/house.ts`：公开房源搜索、详情兜底、图片 URL 过滤
- `services/chat.ts`：咨询消息发送与响应适配
- `services/user.ts`：用户资料与个人主页看板（待后端接口补齐）

## 路由配置

主路由：`miniprogram/app.json`

TabBar：
- `pages/discover/discover`：找房
- `pages/ai/ai`：咨询
- `pages/profile/profile`：我的

独立页：
- `pages/login/login`：登录个人中心
- `pages/house-detail/house-detail`：房源详情

## 运行与联调

1. 使用微信开发者工具打开项目根目录。
2. 确认小程序目录为 `miniprogram`。
3. 在微信开发者工具中编译预览。

### 真机联调说明

- 本地 `127.0.0.1` 仅本机可访问，真机不可用。
- 推荐使用内网穿透（如 ngrok）并将 `BASE_URL` 配置为公网 HTTPS 地址。
- 真机体验权限需在微信公众平台配置正确成员与版本二维码。

## 开发约定

- 全局视觉 token 放在 `miniprogram/app.wxss`
- 页面业务请求统一走 `services/*`
- 统一接口路径规范：`POST /api/v1/{module}/{action}`
- 页面样式优先使用 rpx
- 角色模式：当前默认租客，房东模式在设计中

## 后续开发建议

建议按以下顺序继续推进：

1. 后端补齐 `user/profile`、`user/dashboard`、`user/switch_role`
2. 完成个人页租客端真实数据联调
3. 落地房东模式（discover/ai/profile 同壳双模式）
4. 新增收藏与浏览历史 API（favorite/history）
5. 补齐正式公开详情接口 `/api/v1/house/detail`（替换当前兜底）
