import { defineConfig } from 'vite';
import content from './src/content.js';
import { artFile } from './src/art.js';

// GitHub Pages project site: '/<repo-name>/'. Use '/' for a user site or a custom domain.
const base = '/wedding-invitation/';

const esc = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Meta must be static HTML so WhatsApp / social crawlers (which don't run JS) can read it.
function invitationHead() {
  return {
    name: 'invitation-head',
    transformIndexHtml(html) {
      const { meta, events } = content;
      const image = new URL(meta.ogImage, meta.siteUrl).href;
      const artUrl = (name) => `${base}art/${artFile(name)}`;
      const tags = [
        `<title>${esc(meta.title)}</title>`,
        `<meta name="description" content="${esc(meta.description)}" />`,
        `<link rel="icon" href="${base}favicon.svg" type="image/svg+xml" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${esc(meta.title)}" />`,
        `<meta property="og:description" content="${esc(meta.description)}" />`,
        `<meta property="og:url" content="${esc(meta.siteUrl)}" />`,
        `<meta property="og:image" content="${esc(image)}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(meta.title)}" />`,
        `<meta name="twitter:description" content="${esc(meta.description)}" />`,
        `<meta name="twitter:image" content="${esc(image)}" />`,
        `<link rel="preload" as="image" href="${artUrl('hero-backdrop')}" fetchpriority="high" />`,
        events[0] ? `<link rel="preload" as="image" href="${artUrl(events[0].art)}" />` : '',
      ];
      return html.replace('<!--invitation-head-->', tags.filter(Boolean).join('\n    '));
    },
  };
}

export default defineConfig({
  base,
  plugins: [invitationHead()],
});
