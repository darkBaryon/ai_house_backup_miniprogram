# AI House Mini Program

AI House 微信小程序前端项目。当前阶段以前端页面搭建为主，围绕“AI 看房 / AI 选房 / AI 房源咨询”设计，目标是帮助用户更快完成找房、咨询、收藏和预约看房。

## 项目状态

当前已完成第一版小程序页面骨架：

- 找房页
- 咨询页
- 我的页
- 房源详情页

当前已经接入登录、公开房源搜索和咨询接口，页面里仍有少量临时兜底逻辑，但主链路已经可以联调。

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
│   └── ai-house-miniapp-design.md
├── miniprogram/
│   ├── app.json
│   ├── app.ts
│   ├── app.wxss
│   ├── pages/
│   │   ├── discover/
│   │   ├── ai/
│   │   ├── profile/
│   │   └── house-detail/
│   ├── services/
│   └── utils/
├── typings/
├── package.json
├── project.config.json
└── tsconfig.json
```

## 页面说明

### 找房页

路径：`miniprogram/pages/discover/discover`

找房页当前兼主页使用。当前包含：

- 品牌与产品介绍
- 公开房源推荐卡片
- 搜索入口预留区
- 转咨询入口

### 咨询页

路径：`miniprogram/pages/ai/ai`

咨询页是产品主路径。当前包含：

- 客服对话区
- 常见需求入口
- 房源信息卡
- 追问建议

### 我的页

路径：`miniprogram/pages/profile/profile`

我的页用于承载用户数据和服务入口。当前包含：

- 用户登录提示
- 收藏、浏览、预约、AI 对话统计
- 常用服务入口
- 后续会员 / 深度报告扩展区

### 房源详情页

路径：`miniprogram/pages/house-detail/house-detail`

房源详情页用于展示单套房源信息和转化动作。当前包含：

- 图片轮播占位
- 房源价格与核心信息
- AI 解读卡
- 房源标签
- 小区信息
- 顾问卡片
- 底部固定操作栏

## 设计文档

页面设计方案见：

```text
docs/ai-house-miniapp-design.md
```

该文档包含产品定位、页面架构、用户路径、视觉方向、交互建议和开发优先级。

## 运行方式

1. 使用微信开发者工具打开项目根目录。
2. 确认小程序目录为 `miniprogram`。
3. 在微信开发者工具中编译预览。

当前 `package.json` 没有配置 npm scripts，项目主要通过微信开发者工具运行。

## 路由配置

主路由配置在：

```text
miniprogram/app.json
```

当前 TabBar：

- `pages/discover/discover`：找房
- `pages/ai/ai`：咨询
- `pages/profile/profile`：我的

独立页面：

- `pages/house-detail/house-detail`：房源详情

## 开发约定

- 全局视觉 token 放在 `miniprogram/app.wxss`
- 页面样式优先使用 rpx
- 页面数据当前先放在对应页面的 `*.ts` 中
- 后续接接口时，建议把请求逻辑抽到 `miniprogram/services/`
- 可复用 UI 后续建议抽到 `miniprogram/components/`

## 后续开发建议

建议按以下顺序继续推进：

1. 接入房源列表接口
2. 补齐公开房源详情接口
3. 优化咨询页房源推荐逻辑
4. 抽取通用组件，例如房源卡片、搜索栏、筛选条、客服卡
5. 增加收藏、预约看房、浏览记录等用户行为
