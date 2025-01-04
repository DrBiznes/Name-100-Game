import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import mdx from "@mdx-js/rollup"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from 'remark-gfm'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [rehypePrettyCode, {
          theme: 'github-dark',
          keepBackground: true,
          // Only process JSON and inline code blocks
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('highlighted')
          },
          onVisitLine(node: any) {
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
        }],
      ],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['@mdx-js/react'],
  },
});
