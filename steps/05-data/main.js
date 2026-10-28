/* ============================================================
   第 5 次课 · 图书首页数据驱动版
   数据（books）是唯一真相，HTML 只是数据的「投影」。
   ============================================================ */

let books = [];                                   // ① 一个变量装下整页

const bookList = document.querySelector("#bookList");
const kwInput = document.querySelector("#kw");
const typeSelect = document.querySelector("#type");
const searchForm = document.querySelector("#searchForm");

/* ---------- 渲染三步套路：拼字符串 → 一次性灌入 ---------- */
function render(list) {
  // 空结果也是产品的一部分：先写「没有找到」，再谈渲染
  if (list.length === 0) {
    bookList.innerHTML = "<p class='empty'>没有找到相关图书，换个关键字试试</p>";
    return;                                       // 提前结束，后面的拼接不再执行
  }

  let html = "";                                  // ① 备一个空字符串
  list.forEach(function (b) {                     // ② 每本书拼一段
    html = html +
      "<article class='book-card'>" +
        (b.isNew ? "<span class='badge-new'>NEW</span>" : "") +
        "<div class='cover-box'>" + (b.cover || b.title) + "</div>" +
        "<h3>" + b.title + "</h3>" +
        "<p class='author-name'>作者：" + b.author + "</p>" +
        "<p class='book-price'>¥ " + b.price.toFixed(2) + "</p>" +
        (b.inStock
          ? "<span class='stock'>有货</span>"
          : "<span class='stock out'>暂无库存</span>") +
        "<button class='add-btn' type='button'>加入购物车</button>" +
      "</article>";
  });
  bookList.innerHTML = html;                      // ③ 一次性灌入，只重排一次
}

/* ---------- 搜索：input 事件 → filter → 重新渲染 ---------- */
function applyFilter() {
  const kw = kwInput.value.trim();
  const type = typeSelect.value;
  const result = books.filter(function (b) {
    const matchKw = b.title.includes(kw);         // 空字符串对谁都返回 true = 显示全部
    const matchType = type === "全部" || b.category === type;
    return matchKw && matchType;
  });
  render(result);
}

kwInput.addEventListener("input", applyFilter);
typeSelect.addEventListener("change", applyFilter);
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();                         // 搜索已在本地完成，不再跳转 /search
  applyFilter();
});

/* ---------- fetch：从 books.json 拿数据（两个 then，一步一等） ---------- */
fetch("books.json")
  .then(function (res) {
    return res.json();                            // 拆餐盒：转成 JS 数组
  })
  .then(function (data) {
    books = data;                                 // 数据到手
    render(books);                                // 渲染函数一个字没改
  })
  .catch(function (err) {
    bookList.innerHTML = "<p class='empty'>数据加载失败：" + err.message + "</p>";
  });

/* ---------- 购物车：重新渲染会换掉按钮，所以用事件代理 ---------- */
let count = 0;
const cart = document.querySelector("#cart");

bookList.addEventListener("click", function (event) {
  if (!event.target.classList.contains("add-btn")) return;
  count = count + 1;
  cart.textContent = "购物车 (" + count + ")";
});

/* ---------- 暗色模式（沿用第 4 次课） ---------- */
const modeBtn = document.querySelector("#modeBtn");
modeBtn.addEventListener("click", function () {
  const isDark = document.body.classList.toggle("dark");
  modeBtn.textContent = isDark ? "☀ 亮色" : "🌙 暗色";
});

/* ---------- 回到顶部（沿用第 4 次课） ---------- */
const topBtn = document.querySelector("#topBtn");
topBtn.addEventListener("click", function () {
  window.scrollTo(0, 0);
});
window.addEventListener("scroll", function () {
  topBtn.classList.toggle("show", window.scrollY > 300);
});
