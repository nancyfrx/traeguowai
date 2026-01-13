import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  server: {
    host: "127.0.0.1",
    proxy: {
      "/__auth": {
        // 本地开发时将 CloudBase Auth 回调代理到静态托管域名（避免跨域/路径问题）
        target: "https://cloud1-0g6jrh9hca15e904-1335311920.tcloudbaseapp.com/",
        changeOrigin: true,
      },
    },
    allowedHosts: true,
  },
});
