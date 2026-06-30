import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  base: "/admin-panel/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: resolve(__dirname, "dist/admin-panel"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "admin.html"),
      },
    },
  },
});
