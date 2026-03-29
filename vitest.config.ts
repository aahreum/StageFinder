import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // tsconfig paths와 동일하게 맞춤
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
  },
});
