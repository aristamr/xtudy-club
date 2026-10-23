import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Xtudy Club vive como sección del sitio principal: xtudyclub.com/club (el sitio principal reenvía /club a este proyecto).
// Se publica en dist/club para que las rutas sean iguales aquí y a través del sitio principal.
export default defineConfig({
  base: "/club/",
  build: { outDir: "dist/club", emptyOutDir: true },
  plugins: [react()],
});
