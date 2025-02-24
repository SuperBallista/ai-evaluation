import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  base: "/", // ✅ 정적 파일 경로 설정
  build: {
    outDir: "front", // ✅ 빌드 경로 설정
    assetsDir: "assets", // ✅ 정적 파일이 `/assets/` 폴더에 저장되도록 설정
  }  
});
