import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.praxis-edge.com',
  trailingSlash: 'ignore',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  build: {
    assets: 'assets',
    inlineStylesheets: 'always', // one stylesheet, two pages: inlining removes the last render-blocking fetch
  },
});
