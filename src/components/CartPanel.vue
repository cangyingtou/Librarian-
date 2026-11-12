<script setup>
import { computed } from "vue";

// 购物车面板：纯展示组件 —— 没有自己的数据，给什么显示什么
const props = defineProps({
  cart: { type: Array, required: true },
  total: { type: Number, required: true },
});

// 三个事件都往上报，具体怎么改由父组件（数据的主人）决定
const emit = defineEmits(["remove-from-cart", "increase", "decrease"]);

const cartCount = computed(function () {
  return props.cart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);
});
</script>

<template>
  <section class="side-panel cart-panel">
    <h3>购物车 · 共 {{ cartCount }} 件</h3>

    <!-- 空车也要会说话：这是最常见的状态 -->
    <p v-if="cart.length === 0" class="cart-empty">
      🛒 购物车还是空的
      <span>去上面挑几本书吧</span>
    </p>

    <template v-else>
      <ul class="cart-list">
        <li v-for="item in cart" :key="item.id" class="cart-item">
          <span class="cart-title">{{ item.title }}</span>

          <div class="cart-line">
            <!-- 加减键只喊话，数量本身由 App.vue 改 -->
            <div class="stepper">
              <button
                class="step-btn"
                type="button"
                title="减少一件（减到 0 会移出购物车）"
                aria-label="减少一件"
                @click="emit('decrease', item.id)"
              >
                −
              </button>
              <span class="cart-qty">{{ item.qty }}</span>
              <button
                class="step-btn"
                type="button"
                title="增加一件"
                aria-label="增加一件"
                @click="emit('increase', item.id)"
              >
                ＋
              </button>
            </div>

            <span class="cart-sub">¥ {{ (item.price * item.qty).toFixed(2) }}</span>

            <button
              class="cart-remove"
              type="button"
              title="从购物车移除"
              @click="emit('remove-from-cart', item.id)"
            >
              ×
            </button>
          </div>
        </li>
      </ul>

      <p class="cart-total">
        合计 <strong>¥ {{ total.toFixed(2) }}</strong>
      </p>
    </template>
  </section>
</template>

<style scoped>
.cart-empty {
  margin: 0;
  padding: 18px 0 6px;
  font-size: 14px;
  text-align: center;
  color: var(--muted);
}
.cart-empty span { display: inline-block; margin-top: 6px; font-size: 12px; }

.cart-list { margin: 0; padding: 0; list-style: none; }

.cart-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px dashed var(--line);
}
/* 书名独占一行，窄侧栏里也不会被挤成一条缝 */
.cart-title { flex: 1 1 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.cart-line { display: flex; align-items: center; gap: 8px; flex: 1 1 100%; }

.stepper { display: inline-flex; align-items: center; gap: 4px; }

.step-btn {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 6px;
  cursor: pointer;
}
.step-btn:hover { color: var(--brand-ink); border-color: var(--brand-ink); background: var(--brand-soft); }
.step-btn:active { transform: scale(0.94); }

.cart-qty {
  min-width: 18px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.cart-sub { margin-left: auto; font-variant-numeric: tabular-nums; color: var(--accent); }

.cart-remove {
  width: 20px;
  height: 20px;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  color: var(--muted);
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 50%;
  cursor: pointer;
}
.cart-remove:hover { color: #ffffff; background: var(--stock-out); border-color: var(--stock-out); }

.cart-total {
  display: flex;
  justify-content: space-between;
  margin: 12px 0 0;
  font-size: 14px;
}
.cart-total strong { font-size: 16px; color: var(--accent); }
</style>
