// Generates public/og-image.png from an inline SVG composition.
// Run with: node scripts/build-og.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const W = 1200;
const H = 630;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0e0640"/>
      <stop offset="55%" stop-color="#1a0a6b"/>
      <stop offset="100%" stop-color="#3b1fa8"/>
    </linearGradient>
    <radialGradient id="g1" cx="20%" cy="25%" r="40%">
      <stop offset="0%" stop-color="#7c55f5" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="#7c55f5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="85%" cy="80%" r="35%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>

  <!-- decorative rings -->
  <circle cx="980" cy="160" r="90" fill="none" stroke="#7c55f5" stroke-width="1.5" opacity="0.35"/>
  <circle cx="980" cy="160" r="140" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.18"/>
  <circle cx="980" cy="160" r="200" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.10"/>

  <!-- accent rule -->
  <rect x="80" y="180" width="48" height="4" rx="2" fill="#7c55f5"/>

  <!-- eyebrow -->
  <text x="80" y="160" font-family="'Helvetica Neue', Arial, sans-serif" font-size="18"
        font-weight="600" letter-spacing="3" fill="#a78bfa" text-transform="uppercase">
    DUBAI · UAE · SERVING MENA
  </text>

  <!-- wordmark: praxis edge -->
  <text x="80" y="280" font-family="Georgia, 'Times New Roman', serif" font-size="92"
        font-weight="700" fill="#c0b8d8">praxis</text>
  <text x="450" y="280" font-family="Georgia, 'Times New Roman', serif" font-size="92"
        font-weight="700" fill="#ffffff">edge</text>
  <line x1="450" y1="208" x2="540" y2="208" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>

  <!-- headline -->
  <text x="80" y="385" font-family="'Helvetica Neue', Arial, sans-serif" font-size="46"
        font-weight="800" letter-spacing="-1.2" fill="#ffffff">
    Education marketing meets
  </text>
  <text x="80" y="440" font-family="'Helvetica Neue', Arial, sans-serif" font-size="46"
        font-weight="800" letter-spacing="-1.2" fill="#ffffff">
    campus design — under one roof.
  </text>

  <!-- subline -->
  <text x="80" y="505" font-family="'Helvetica Neue', Arial, sans-serif" font-size="22"
        font-weight="300" fill="rgba(255,255,255,0.72)">
    Brand strategy. Enrollment. Spaces. Across the UAE and MENA.
  </text>

  <!-- footer chip -->
  <rect x="80" y="540" width="280" height="42" rx="21" fill="rgba(124,85,245,0.20)"
        stroke="rgba(124,85,245,0.45)" stroke-width="1"/>
  <circle cx="103" cy="561" r="5" fill="#a78bfa"/>
  <text x="120" y="567" font-family="'Helvetica Neue', Arial, sans-serif" font-size="14"
        font-weight="600" letter-spacing="2" fill="#a78bfa">
    A PRAXIS ADVERTISING INITIATIVE
  </text>

  <!-- url badge -->
  <text x="${W - 80}" y="567" text-anchor="end"
        font-family="'Helvetica Neue', Arial, sans-serif" font-size="14"
        font-weight="600" letter-spacing="2" fill="rgba(255,255,255,0.45)">
    PRAXIS-EDGE.COM
  </text>
</svg>`;

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '..', 'public', 'og-image.png');
await mkdir(dirname(out), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log('Wrote', out);
