import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://yapi.juwan-inc.com/',
      changeOrigin: true,
    }          
  },
});
