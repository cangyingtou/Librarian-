<script setup>
import { ref, computed } from "vue";
import BookCard from "./components/BookCard.vue";
import CartPanel from "./components/CartPanel.vue";
import "./style.css"; // 第 2、3 次课的样式整包搬进项目，一个类名都不用改

const shopName = ref("校园图书屋");

/* 数据是唯一真相：页面 = f(数据)。第 5 次课的 fetch 版下次课接真接口。 */
const books = ref([
  { id: 1, title: "Python 编程从入门到实践", author: "埃里克·马瑟斯", price: 89, category: "计算机", cover: "Python", inStock: true, isNew: true },
  { id: 2, title: "深入理解计算机系统", author: "兰德尔·布莱恩特", price: 139, category: "计算机", cover: "CSAPP", inStock: true, isNew: false },
  { id: 3, title: "编译原理", author: "阿尔弗雷德·阿霍", price: 59, category: "计算机", cover: "编译", inStock: false, isNew: false },
  { id: 4, title: "计算机网络", author: "谢希仁", price: 52, category: "计算机", cover: "网络", inStock: true, isNew: false },
  { id: 5, title: "设计模式", author: "埃里希·伽玛", price: 58, category: "计算机", cover: "设计", inStock: false, isNew: false },
  { id: 6, title: "西游记", author: "吴承恩", price: 42, category: "文学", cover: "西游", inStock: true, isNew: true },
]);

const keyword = ref("");
const category = ref("全部");
const isDark = ref(false);

/* ---------------- 购物车：数据住在 App.vue（状态提升） ---------------- */
const cart = ref([]); // [{ ...book, qty }]

const cartCount = computed(function () {
  return cart.value.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
});

const total = computed(function () {
  return cart.value.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);
});

// 子组件只是「喊了一嗓子」，改数据是数据主人的事
function handleAdd(book) {
  const found = cart.value.find(function (item) {
    return item.id === book.id;
  });
  if (found) {
    found.qty = found.qty + 1; // 已在车里：数量加一
  } else {
    cart.value.push({ ...book, qty: 1 }); // 新书：复制一份再入车，别污染 books
  }
}

function handleRemove(id) {
  cart.value = cart.value.filter(function (item) {
    return item.id !== id;
  });
}

// 购物车里的加减：同一本书改数量，减到 0 就整行移出
function increaseQty(id) {
  const found = cart.value.find(function (item) {
    return item.id === id;
  });
  if (found) found.qty = found.qty + 1;
}

function decreaseQty(id) {
  const found = cart.value.find(function (item) {
    return item.id === id;
  });
  if (!found) return;
  if (found.qty > 1) {
    found.qty = found.qty - 1;
  } else {
    handleRemove(id);
  }
}

/* ---------------- 上架新书 ---------------- */
const showForm = ref(false);
const formError = ref("");
const shelvedCount = ref(0); // 本次上架的新书数量
const flashId = ref(null); // 刚上架的那本书，高亮一下让人看见
let nextId = 7;
let flashTimer = null;

// 表单数据也是一个 ref 对象：v-model 直接绑到字段上
const form = ref({
  title: "",
  author: "",
  price: "",
  category: "计算机",
  cover: "",
  inStock: true,
  isNew: true,
});

function toggleForm() {
  showForm.value = !showForm.value;
  formError.value = ""; // 收起或展开时把上一次的错误提示清掉
}

function resetForm() {
  form.value.title = "";
  form.value.author = "";
  form.value.price = "";
  form.value.cover = "";
  form.value.inStock = true;
  form.value.isNew = true;
}

function submitBook() {
  const title = form.value.title.trim();
  const author = form.value.author.trim();
  const price = Number(form.value.price);

  // 校验：错误提示写在表单里，不要用 alert 打断操作
  if (title === "") {
    formError.value = "书名不能为空";
    return;
  }
  if (title.length > 30) {
    formError.value = "书名太长了（最多 30 个字）";
    return;
  }
  if (author === "") {
    formError.value = "作者不能为空";
    return;
  }
  if (!Number.isFinite(price) || price <= 0) {
    formError.value = "价格要填大于 0 的数字";
    return;
  }
  if (price > 10000) {
    formError.value = "价格看起来不对劲（超过 10000 元）";
    return;
  }
  formError.value = "";

  const book = {
    id: nextId++, // 用自增 id 当 key：书名可能重复，id 不会
    title: title,
    author: author,
    price: Math.round(price * 100) / 100, // 统一两位小数
    category: form.value.category,
    cover: form.value.cover.trim() || title.slice(0, 3), // 没填封面就用书名前三个字
    inStock: form.value.inStock,
    isNew: form.value.isNew,
  };
  books.value.push(book);
  shelvedCount.value = shelvedCount.value + 1;

  // 清掉筛选条件，保证刚上架的书一定看得见，并高亮 1.8 秒
  keyword.value = "";
  category.value = "全部";
  flashId.value = book.id;
  clearTimeout(flashTimer);
  flashTimer = setTimeout(function () {
    flashId.value = null;
  }, 1800);

  resetForm();
}

/* ---------------- 搜索 / 分类 ---------------- */
// 手动新增的分类（还没上架任何书也会先用着）
const extraCategories = ref([]);
const addCategoryOpen = ref(false);
const newCategoryName = ref("");
const categoryError = ref("");

function unique(list) {
  return list.filter(function (name, index) {
    return list.indexOf(name) === index;
  });
}

// 表单里能选的分类：书里已有的 + 手动加的
const allCategories = computed(function () {
  const used = books.value.map(function (b) {
    return b.category;
  });
  return ["全部"].concat(unique(used.concat(extraCategories.value)));
});

// 侧栏分类导航：只列真的有书的分类，点进去不会空空如也
const bookCategories = computed(function () {
  const used = books.value.map(function (b) {
    return b.category;
  });
  return ["全部"].concat(unique(used));
});

function toggleAddCategory() {
  addCategoryOpen.value = !addCategoryOpen.value;
  newCategoryName.value = "";
  categoryError.value = "";
}

function confirmCategory() {
  const name = newCategoryName.value.trim();
  if (name === "") {
    categoryError.value = "分类名不能为空";
    return;
  }
  if (name === "全部") {
    categoryError.value = "「全部」是保留项，换个名字";
    return;
  }
  if (allCategories.value.indexOf(name) !== -1) {
    categoryError.value = "这个分类已经存在了";
    return;
  }
  extraCategories.value.push(name);
  form.value.category = name; // 新增后直接选中它
  categoryError.value = "";
  newCategoryName.value = "";
  addCategoryOpen.value = false;
}

function cancelCategory() {
  addCategoryOpen.value = false;
  newCategoryName.value = "";
  categoryError.value = "";
}

const visibleBooks = computed(function () {
  const kw = keyword.value.trim();
  return books.value.filter(function (b) {
    const hitKeyword = b.title.includes(kw); // 清空输入 = 显示全部
    const hitCategory = category.value === "全部" || b.category === category.value;
    return hitKeyword && hitCategory;
  });
});

/* ---------------- 回到顶部 ---------------- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <div class="page" :class="{ dark: isDark }">
    <header class="site-header">
      <a class="brand" href="#top">
        <span class="brand-mark" aria-hidden="true">校</span>
        {{ shopName }}
      </a>

      <nav class="site-nav">
        <a href="#search">检索</a>
        <a href="#books">新书</a>
        <a href="#about">关于</a>
      </nav>

      <div class="header-tools">
        <!-- v-on 简写 @：替代 addEventListener -->
        <button class="mode-btn" type="button" @click="isDark = !isDark">
          {{ isDark ? "☀ 亮色" : "🌙 暗色" }}
        </button>
        <span class="cart">购物车 ({{ cartCount }})</span>
      </div>
    </header>

    <main id="top">
      <section id="search" class="search-bar">
        <!-- v-model：搜索框和 keyword 双向绑定，不再 querySelector -->
        <form @submit.prevent>
          <label for="kw">书名关键字</label>
          <input id="kw" v-model="keyword" type="search" placeholder="输入书名，如：计算机" />

          <label for="type">图书分类</label>
          <select id="type" v-model="category">
            <option v-for="name in allCategories" :key="name" :value="name">{{ name }}</option>
          </select>

          <button type="submit">检索</button>
        </form>
      </section>

      <section id="books" class="book-area">
        <div class="section-head">
          <h2>新书推荐</h2>
          <div class="head-meta">
            <span class="result-count">{{ visibleBooks.length }} / {{ books.length }} 本</span>
            <span v-if="shelvedCount > 0" class="shelved-count">本次上架 {{ shelvedCount }} 本</span>
            <button class="toggle-form-btn" type="button" @click="toggleForm">
              {{ showForm ? "收起表单" : "＋ 上架新书" }}
            </button>
          </div>
        </div>

        <!-- 上架表单：数据绑到 form 上，校验通过才 push 进 books -->
        <form v-if="showForm" class="shelf-form" @submit.prevent="submitBook">
          <h3>上架新书</h3>

          <div class="form-grid">
            <div class="field">
              <label for="nb-title">书名 <em>*</em></label>
              <input id="nb-title" v-model="form.title" type="text" placeholder="例如：三体" maxlength="30" />
            </div>

            <div class="field">
              <label for="nb-author">作者 <em>*</em></label>
              <input id="nb-author" v-model="form.author" type="text" placeholder="例如：刘慈欣" maxlength="20" />
            </div>

            <div class="field">
              <label for="nb-price">价格（元）<em>*</em></label>
              <input id="nb-price" v-model="form.price" type="number" min="0.01" step="0.01" placeholder="39.50" />
            </div>

            <div class="field">
              <label for="nb-category">分类</label>
              <div class="select-with-add">
                <select id="nb-category" v-model="form.category">
                  <option v-for="name in allCategories.slice(1)" :key="name" :value="name">
                    {{ name }}
                  </option>
                </select>
                <button
                  class="mini-btn"
                  type="button"
                  :title="addCategoryOpen ? '收起新分类' : '新增分类'"
                  @click="toggleAddCategory"
                >
                  ＋
                </button>
              </div>

              <!-- 内联新增分类：加完自动选中，不用先跑去别处维护 -->
              <div v-if="addCategoryOpen" class="new-category">
                <input
                  v-model="newCategoryName"
                  type="text"
                  maxlength="10"
                  placeholder="新分类，如：历史"
                  @keydown.enter.prevent="confirmCategory"
                />
                <button class="mini-btn" type="button" @click="confirmCategory">添加</button>
                <button class="mini-btn ghost" type="button" @click="cancelCategory">取消</button>
              </div>
              <p v-if="categoryError" class="field-error">{{ categoryError }}</p>
            </div>

            <div class="field">
              <label for="nb-cover">封面文字</label>
              <input id="nb-cover" v-model="form.cover" type="text" placeholder="留空则取书名前三个字" maxlength="8" />
            </div>

            <div class="field field-check">
              <span class="field-label">状态</span>
              <div class="check-row">
                <label class="check">
                  <input v-model="form.inStock" type="checkbox" />
                  有货
                </label>
                <label class="check">
                  <input v-model="form.isNew" type="checkbox" />
                  标记为 NEW
                </label>
              </div>
            </div>
          </div>

          <p v-if="formError" class="form-error">{{ formError }}</p>

          <div class="form-actions">
            <button class="btn-primary" type="submit">上架</button>
            <button class="btn-ghost" type="button" @click="toggleForm">取消</button>
          </div>
        </form>

        <div class="book-list">
          <!-- v-for 现在作用在组件标签上：一张卡片模板只写一份，数据由 props 递给子组件 -->
          <BookCard
            v-for="b in visibleBooks"
            :key="b.id"
            :book="b"
            :class="{ flash: flashId === b.id }"
            @add-to-cart="handleAdd"
          />

          <p v-if="visibleBooks.length === 0" class="empty">
            没有找到相关图书，换个关键字试试
          </p>
        </div>
      </section>

      <aside id="about">
        <!-- 购物车面板：兄弟组件通过父组件这座桥联动 -->
        <CartPanel
          :cart="cart"
          :total="total"
          @remove-from-cart="handleRemove"
          @increase="increaseQty"
          @decrease="decreaseQty"
        />

        <section class="side-panel">
          <h3>分类导航</h3>
          <ul class="category-list">
            <li v-for="name in bookCategories.slice(1)" :key="name">
              <button
                type="button"
                :class="{ active: category === name }"
                @click="category = category === name ? '全部' : name"
              >
                {{ name }}
              </button>
            </li>
          </ul>
        </section>

        <section class="side-panel">
          <h3>本周热榜</h3>
          <ol>
            <li>深入理解计算机系统</li>
            <li>Python 编程从入门到实践</li>
            <li>西游记</li>
            <li>设计模式</li>
          </ol>
        </section>

        <section class="side-panel">
          <h3>借阅须知</h3>
          <p>凭校园卡借阅，每人限借 5 本，借期 30 天。</p>
        </section>
      </aside>
    </main>

    <button class="to-top" type="button" title="回到顶部" @click="scrollToTop">↑</button>

    <footer>
      <p>版权所有 © 2026 校园图书屋 · Web 应用程序设计课程案例</p>
    </footer>
  </div>
</template>
