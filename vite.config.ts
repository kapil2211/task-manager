/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,        // ✅ THIS IS REQUIRED
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
  