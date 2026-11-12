<script setup>
// 书卡组件：只负责「长什么样」，数据靠 props 收，点击靠 emit 上报
defineProps({
  book: { type: Object, required: true },
});

const emit = defineEmits(["add-to-cart"]);
</script>

<template>
  <article class="book-card" :class="{ 'out-of-stock': !book.inStock }">
    <span v-if="book.isNew" class="badge-new">NEW</span>

    <div class="cover-box">{{ book.cover || book.title.slice(0, 3) }}</div>
    <h3>{{ book.title }}</h3>
    <p class="author-name">作者：{{ book.author }}</p>
    <p class="book-price">¥ {{ book.price.toFixed(2) }}</p>

    <span class="stock" :class="{ out: !book.inStock }">
      {{ book.inStock ? "有货" : "暂无库存" }}
    </span>

    <!-- 只喊一嗓子「有人加购了」，并把这本 book 递出去；改数据是父组件的事 -->
    <button class="add-btn" type="button" @click="emit('add-to-cart', book)">
      加入购物车
    </button>
  </article>
</template>

<style scoped>
/* 书卡自己的样式跟着组件走：改这里，所有书卡一起变 */
.book-card {
  position: relative;
  padding: 16px;
  text-align: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 10px;
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}
.book-card:hover {
  box-shadow: var(--shadow);
  border-color: var(--brand-ink);
  transform: translateY(-3px);
}
/* 缺货的卡片整体淡一点（第 7 次课加分项） */
.book-card.out-of-stock { opacity: 0.72; }

.book-card h3 {
  height: 44px;
  margin: 10px 0 6px;
  overflow: hidden;
  font-size: 15px;
  line-height: 22px;
}

.cover-box {
  height: 132px;
  display: grid;
  place-items: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--cover-ink);
  background: linear-gradient(135deg, var(--cover-1), var(--cover-2));
  border-radius: 8px;
}

.author-name { margin: 0 0 6px; font-size: 13px; color: var(--muted); }
.book-price { margin: 0; font-weight: 700; color: var(--accent); }

.stock {
  display: inline-block;
  margin: 8px 0 2px;
  padding: 2px 10px;
  font-size: 12px;
  color: var(--stock);
  background: color-mix(in srgb, var(--stock) 12%, transparent);
  border-radius: 999px;
}
.stock.out {
  color: var(--stock-out);
  background: color-mix(in srgb, var(--stock-out) 12%, transparent);
}

.add-btn {
  width: 100%;
  margin-top: 10px;
  padding: 9px;
  font-size: 14px;
  color: var(--brand-ink);
  background: transparent;
  border: 1px solid var(--brand-ink);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.add-btn:hover { color: #ffffff; background: var(--brand); }
.page.dark .add-btn:hover { color: #0b1a31; background: var(--brand-ink); }
.add-btn:active { transform: scale(0.98); }

.badge-new {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  padding: 2px 8px;
  font-size: 12px;
  color: #ffffff;
  background: var(--accent);
  border-radius: 999px;
}

@media (max-width: 600px) {
  .cover-box { height: 160px; }
}
</style>
