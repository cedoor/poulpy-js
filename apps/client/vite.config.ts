import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Expose POULPY_* from .env on import.meta.env (same key as server: POULPY_PARAMS_SET).
  envPrefix: ["VITE_", "POULPY_"],
  server: {
    port: 5173,
    // Needed for SharedArrayBuffer / cross-origin isolation if we later want
    // wasm threading; harmless for the single-threaded demo.
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["poulpy-js"],
  },
  build: {
    target: "es2022",
  },
});
