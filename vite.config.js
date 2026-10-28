import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Vite 把 .vue 文件编译成浏览器能懂的 JS，并提供一个秒级启动的开发服务器
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: false,
  },
});
