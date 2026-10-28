# 校园图书屋 · Web 应用程序设计课程案例

同一个「图书首页」，按六次课的进度一路写下来：**float 静态版 → Flex 响应式 → JS 交互 → 数据驱动 → Vue 化**。
根目录是第 6 次课的 Vue 版成品，`steps/` 里留着每一课的阶段成果，方便对照、回看、讲解。

## 目录结构

```
book-home/
├─ index.html            # Vite 入口，<div id="app"> 是 Vue 的挂载点
├─ package.json          # vue + vite + @vitejs/plugin-vue
├─ vite.config.js        # 端口 5173
├─ src/
│  ├─ main.js            # createApp(App).mount("#app")，只干这一件事
│  ├─ App.vue            # 今天的主战场：数据、模板、交互全在这
│  └─ style.css          # 第 2、3 次课的样式整包搬进来（类名一个都没改）
└─ steps/
   ├─ 02-static/         # 第 2 次课：float 布局 + 独立检索页
   ├─ 03-flex/           # 第 3 次课：Flex 骨架 + 换行网格 + 媒体查询 + 新书角标
   ├─ 04-js/             # 第 4 次课：暗色切换、购物车计数、回到顶部
   └─ 05-data/           # 第 5 次课：books.json + fetch + 实时搜索 + 空结果
```

## 运行

**Vue 版（根目录）**

```bash
npm install
npm run dev          # http://localhost:5173
```

> 第 6 次课的项目就是 Vite 工程：改 `App.vue` 存盘，浏览器热更新，不用手动刷新。
> 如果 `npm install` 因为本机网络卡住，先确认 `node -v` ≥ 18，再检查终端最后几行报错。

**各阶段成果**

- `steps/02-static/`、`03-flex/`、`04-js/`：双击 `index.html` 就能看（也可以右键 Open with Live Server）。
- `steps/05-data/`：**必须走 http**，因为它用 `fetch("books.json")`。用 Live Server 打开这个目录即可；
  直接双击会是 `file://`，fetch 被浏览器拦下，页面空白 —— 这正是第 1 次课说的「http:// 与 file:// 的区别」。

## 六次课对照

| 课次 | 阶段 | 关键改动 | 验收点 |
| --- | --- | --- | --- |
| 1 | 环境与 HTTP | 项目骨架、Git 首次提交 | DevTools 里能看到文档与静态资源请求 |
| 2 | `steps/02-static` | HTML 结构 + float 布局 + 独立检索页 | 六张书卡并排，样式分离 |
| 3 | `steps/03-flex` | 删 float/clear，`body` 开 flex column、`main` 拿 `flex:1`；`.book-list` 用 `wrap + gap`，卡片 `flex:1 + min-width:220px`；`viewport` + 两档媒体查询；父相子绝做 NEW 角标 | 三档屏幕：桌面三列、平板两列、手机单列；footer 永远贴底 |
| 4 | `steps/04-js` | 三步法：找元素 → 绑事件 → 改状态；暗色 `classList.toggle`、购物车计数、`fixed` 回到顶部 | 点暗色整页换肤；点两本购物车变 2；滚过一屏出现回顶按钮 |
| 5 | `steps/05-data` | `books` 数组套对象 → `forEach` 拼字符串 → 一次性 `innerHTML`；`input + filter` 实时搜索；`fetch + 两个 then` 读 `books.json`；空结果显示提示 | Network 里 `books.json` 状态 200；搜「计算机」只剩计算机类；搜「zzz」出现「没有找到相关图书」 |
| 6 | 根目录 Vue 版 | 结构搬进 `App.vue`，样式整包 import；`ref` + 插值；`v-for` 渲染书卡；`@click` 换掉 `addEventListener`；`v-model` 双向绑定搜索框 | 改数组页面自动变；点「加入购物车」计数 +1，全程没写一行 DOM 操作 |

## 第 6 次课「逐行讲清楚」速查

- `books = ref([...])`：一份数据就是整页的真相，`v-for` 让页面成为数据的投影。
- `computed(visibleBooks)`：搜索与分类筛选的**派生数据**，依赖变了自动重算，替代第 5 次课的「手动重渲染」。
- `cartCount.value++`：`script` 里改 `ref` 必须带 `.value`，`template` 里 Vue 自动解包 —— 所以模板写 `{{ cartCount }}`。
- `@click="isDark = !isDark"`：`v-on` 的事件处理就是一个 JS 表达式，等价于第 4 次课的 `classList.toggle("dark")`。
- 暗色：`.page.dark` 只换一套 CSS 变量（`--paper` / `--card` / `--ink`），配色变化全交给 CSS。
- 吸顶页头用 `position: sticky`，等价于第 3 次课的 `fixed`，好处是不用给 `body` 补 padding。

## 与课件不完全一致的地方（有意为之）

1. **两个坏掉的输入框**：原 `index.html` / `search.html` 里是 `<input None>`，已补成 `type="text" id="kw" name="kw"`，否则点输入框没有可编辑区域。
2. **类名统一**：阶段 3 起改用课件里的 `.book-list` / `.book-card` / `.badge-new`（原来叫 `.card-list` / `.book`），后续 `v-for` 生成的 HTML 只认这套名字。
3. **断点**：`991px` 与 `600px` 两档，对应课件「桌面 ≥992 / 平板 601–991 / 手机 ≤600」。
4. **搜索框的「检索」按钮**：第 5、6 次课里搜索已实时生效，按钮只保留回车提交的语义（`@submit.prevent`），不再跳 `/search`。
5. **`.card` 换名**：第 4、5 次课课件示例用 `.card`，本案例沿用第 2 次课的 `.book-card`，避免和卡片内部元素混淆。

## 下一步（第 7 次课）

`BookCard` 组件 + `props` 父传子 + `v-model` 搜索框 —— 把 `App.vue` 里那段 `v-for` 的卡片模板拆成组件；
再往后接真实接口，把 `books` 从写死的数组换成 `fetch` 回来的数据。
