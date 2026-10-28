/* ============================================================
   第 4 次课 · 图书首页交互版
   万变不离三步：找元素 → 绑事件 → 改状态
   ============================================================ */

/* ---------- 案例 A：暗色模式（classList.toggle） ---------- */
const modeBtn = document.querySelector("#modeBtn");
modeBtn.addEventListener("click", function () {
  // 颜色不在这里改，只在 body 上切一个类名，样式交给 CSS
  const isDark = document.body.classList.toggle("dark");
  modeBtn.textContent = isDark ? "☀ 亮色" : "🌙 暗色";
});

/* ---------- 案例 B：购物车计数器（状态 → 页面） ---------- */
let count = 0;                                   // 状态：真相存在变量里
const cart = document.querySelector("#cart");
const addBtns = document.querySelectorAll(".add-btn");

addBtns.forEach(function (btn) {                 // 一组按钮，挨个绑事件
  btn.addEventListener("click", function () {
    count = count + 1;                           // 先改状态
    cart.textContent = "购物车 (" + count + ")";  // 再让页面追上状态
  });
});

/* ---------- 动手②：回到顶部（fixed + click + scrollTo） ---------- */
const topBtn = document.querySelector("#topBtn");

topBtn.addEventListener("click", function () {
  window.scrollTo(0, 0);                         // 一步回顶
});

// 页面往下滚过一屏才显示按钮，避免挡住页头
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    topBtn.classList.add("show");
  } else {
    topBtn.classList.remove("show");
  }
});
