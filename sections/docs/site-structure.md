# 站点结构说明

这份文档记录个人网站的非旅行通用结构。旅行计划的内容、地图、照片和行程数据规范见 `../travel/docs/travel-plan-guidelines.md`。

## 页面入口

- `/index.html` 是个人主页，展示 About、Education、News、Publications，以及 Blog 和 Travel 的主入口。
- `/sections/` 是站点总入口，用于在 About、Blog、Travel 之间切换。
- `/sections/blog/` 是 Blog 列表页，具体文章放在对应子目录下。
- `/sections/travel/` 是 Travel 总入口页，具体旅行计划放在 `sections/travel/plans/<trip-slug>/` 下。

## 样式文件

- `home.css` 位于仓库根目录，只服务个人主页 `/index.html`。
- `sections/site-index.css` 服务 `sections/` 体系下的入口页：
  - `/sections/`
  - `/sections/blog/`
  - `/sections/travel/`
- 旅行详情页不使用 `home.css` 或 `sections/site-index.css`，它们使用 `sections/travel/css/` 下的旅行专用样式。

## 内容边界

- 个人主页只保留 `About`、`Blog`、`Travel` 等主入口，不把所有具体旅行计划堆在主页顶部。
- Blog 和 Travel 的入口卡片应保持统一的对齐、间距和卡片风格。
- 旅行计划的具体行程、地图、照片、预算和数据结构规则不要写进本站点结构文档，应维护在旅行规范文档中。
- 站点入口页只负责导航和摘要，不承载具体文章正文或具体旅行行程。
