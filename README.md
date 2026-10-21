<div align="right"><sub><code>iCxin / SingleFile-scau</code></sub></div>

# SingleFile-scau

> SCAU 校园站点的网页存档索引：把单文件 HTML 快照放进 `HTML/`，由索引页统一检索。
> A web archive index for SCAU campus notices: drop single-file HTML snapshots into `HTML/` and browse them from one page.

| | |
|:--|:--|
| **状态** | 维护中 |
| **栈** | `Node.js` · `Express 5` · `EJS` |
| **平台** | 浏览器 / GitHub Pages / Node.js 20 |
| **许可** | ISC（`package.json` 声明） |

---

## 01 · 这是什么

一个存档索引站，不是抓取工具。仓库里只有两样东西：`HTML/` 目录下的单文件网页快照，以及把它们列成一张可搜索表格的 Express + EJS 应用。快照本身离线可打开，索引页只负责目录。

文件名即元数据，规则是 `YYYY-MM-DD-HH-mm-ss-标题.html`：构建或渲染时按此解析出日期、时间与标题，并按时间倒序排列。

## 02 · 特性

| 能力 | 说明 |
|:--|:--|
| 文件名解析 | 从 `YYYY-MM-DD-HH-mm-ss-标题.html` 提取日期、时间、标题 |
| 倒序列表 | 最新快照排在最前 |
| 搜索 | 输入框按标题或日期过滤 |
| 排序 | 点击“日期 / 时间”或“标题”列切换排序 |
| 计数 | 控制栏右侧显示快照总数 |
| 移动端 | 窄屏下表格转为卡片布局并隐藏表头 |
| 空状态 | `HTML/` 无文件时提示文件应放的位置 |
| 两种形态 | 服务端渲染（`server.js`）或预生成静态页（`build.js`） |
| 静态托管 | `HTML/` 挂在 `/HTML` 路径下直接访问 |
| 自动部署 | 推送 `main` 后由 Actions 构建并发布到 GitHub Pages |

## 03 · 目录结构

| 路径 | 作用 |
|:--|:--|
| `HTML/` | 单文件网页快照 |
| `views/index.ejs` | 索引页模板，含样式与筛选脚本 |
| `server.js` | Express 服务，端口 3000，`/` 渲染索引、`/HTML` 静态托管 |
| `build.js` | 读取 `HTML/`，把模板渲染成 `index.html` |
| `index.html` | 构建产物，供静态托管使用 |
| `.github/workflows/deploy.yml` | GitHub Pages 构建与发布 |
| `CNAME` | 自定义域名 `singlefile.cxin.net` |

## 04 · 开始使用

需要 Node.js 20（与部署 workflow 一致）。

```bash
npm ci
```

本地预览：

```bash
npm start
```

默认地址 `http://localhost:3000`。

生成静态索引：

```bash
npm run build
```

新增存档：按命名规则把快照放入 `HTML/`，再重新渲染或重启服务。

## 05 · 部署

`deploy.yml` 在推送 `main` 或手动触发时执行：`npm ci`、`npm run build`，把 `index.html` 与 `HTML/` 复制到 `public/`，然后上传并发布 Pages 产物。自定义域名由 `CNAME` 指定。

## 06 · 设计取舍

- 快照直接进仓库，索引只读本地目录，部署不需要后端；代价是仓库体积随存档增长，单个快照已达约 32 MB。
- 文件名解析规则在 `server.js` 与 `build.js` 里各写一份，改动时需要同步。
- 日期、时间、标题全部来自文件名，改名等于改索引；不符合规则的命名会回落到 `Unknown`。
- 排序与筛选都在前端完成，没有分页，条目变多时表格会变长。

## 07 · 许可

`package.json` 声明 ISC，仓库未附 LICENSE 文件。

---

<div align="right"><sub>从像素到混凝土 · <a href="https://github.com/iCxin">iCxin</a></sub></div>
