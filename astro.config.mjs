import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://louismollick.github.io",
  base: "/cure-dolly-drills",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
