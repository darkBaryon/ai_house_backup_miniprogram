# AI House Mini Program

AI House 微信小程序前端项目。当前阶段以前端页面搭建为主，围绕“AI 看房 / AI 选房 / AI 房源咨询”设计，目标是帮助用户更快完成找房、咨询、收藏和预约看房。

## 项目状态

当前已完成第一版小程序页面骨架：

- 首页
- 找房页
- AI 顾问页
- 我的页
- 房源详情页

页面目前使用静态示例数据，主要用于确认产品信息架构、视觉方向和页面流转。后续接入后端时，可以优先替换各页面 `*.ts` 中的 mock 数据。

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
│   │   ├── home/
│   │   ├── discover/
│   │   ├── ai/
│   │   ├── profile/
│   │   ├── property-detail/
│   │   ├── index/
│   │   └── logs/
│   └── utils/
├── typings/
├── package.json
├── project.config.json
└── tsconfig.json
```

## 页面说明

### 首页

路径：`miniprogram/pages/home/home`

首页用于承接品牌认知、搜索入口、AI 选房入口、快捷功能和推荐房源。当前包含：

- AI House 顶部品牌区
- 城市展示
- 搜索入口
- 快捷筛选标签
- AI Hero 卡片
- 快捷入口宫格
- 今日推荐
- AI 猜你喜欢
- 专属顾问卡片

### 找房页

路径：`miniprogram/pages/discover/discover`

找房页用于承载房源列表和筛选。当前包含：

- 搜索栏
- 筛选工具条
- AI 智能筛选提示
- 房源列表卡片
- 空状态转 AI 顾问入口

### AI 顾问页

路径：`miniprogram/pages/ai/ai`

AI 顾问页是产品差异化核心。当前包含：

- AI 欢迎区
- 常见需求入口
- 对话预览
- AI 结构化输出卡片
- 追问建议
- 生成选房清单 / 转人工顾问按钮

### 我的页

路径：`miniprogram/pages/profile/profile`

我的页用于承载用户数据和服务入口。当前包含：

- 用户登录提示
- 收藏、浏览、预约、AI 对话统计
- 常用服务入口
- 后续会员 / 深度报告扩展区

### 房源详情页

路径：`miniprogram/pages/property-detail/property-detail`

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

- `pages/home/home`：首页
- `pages/discover/discover`：找房
- `pages/ai/ai`：AI顾问
- `pages/profile/profile`：我的

独立页面：

- `pages/property-detail/property-detail`：房源详情

## 开发约定

- 全局视觉 token 放在 `miniprogram/app.wxss`
- 页面样式优先使用 rpx
- 页面数据当前先放在对应页面的 `*.ts` 中
- 后续接接口时，建议把请求逻辑抽到 `miniprogram/services/`
- 可复用 UI 后续建议抽到 `miniprogram/components/`

## 后续开发建议

建议按以下顺序继续推进：

1. 接入房源列表接口
2. 接入房源详情接口
3. 接入 AI 顾问聊天接口
4. 抽取通用组件，例如房源卡片、搜索栏、筛选条、AI 解读卡、顾问卡
5. 增加收藏、预约看房、浏览记录等用户行为
6. 清理旧测试页面 `pages/index` 和 `pages/logs`

## 备注

`pages/index` 和 `pages/logs` 是早期测试页面，目前仍保留在仓库中，但已经不在新的 `app.json` 主路由里。后续确认不再需要后，可以删除。
