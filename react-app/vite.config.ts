import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages project site: base MUST equal "/<RepoName>/".
  // Driven by the repo name (GirardOhioWater), not the react-app/ subfolder.
  base: "/GirardOhioWater/",
  define: {
    // Re-evaluated on every `vite build`, so the live site shows deploy time.
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
