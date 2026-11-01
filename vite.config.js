import { defineConfig } from 'vite';
export default defineConfig({
 base:process.env.GITHUB_PAGES==='true'?'/rappiopedia/':'/',
 build:{outDir:'dist',emptyOutDir:true,target:'es2022',sourcemap:true},
});
