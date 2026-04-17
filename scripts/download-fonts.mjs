#!/usr/bin/env node
/**
 * Font Download Script
 * Downloads Inter, Poppins, and Orbitron WOFF2 files for self-hosting.
 * Eliminates render-blocking Google Fonts @import.
 * Run: node scripts/download-fonts.mjs
 */

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import https from 'https';

const FONTS_DIR = new URL('../public/fonts', import.meta.url).pathname;

// Google Fonts CDN URLs for WOFF2 (subset: latin, modern browsers)
const FONTS = [
  // Inter Variable - covers all weights in one file (~75KB)
  {
    name: 'inter-var',
    url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2',
    filename: 'inter-var.woff2',
  },
  // Poppins 400 Regular
  {
    name: 'poppins-400',
    url: 'https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2',
    filename: 'poppins-400.woff2',
  },
  // Poppins 600 SemiBold
  {
    name: 'poppins-600',
    url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6V1tvFP-KUEg.woff2',
    filename: 'poppins-600.woff2',
  },
  // Poppins 700 Bold
  {
    name: 'poppins-700',
    url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7V1tvFP-KUEg.woff2',
    filename: 'poppins-700.woff2',
  },
  // Orbitron 700 Bold (used for ONE decorative element)
  {
    name: 'orbitron-700',
    url: 'https://fonts.gstatic.com/s/orbitron/v30/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1.woff2',
    filename: 'orbitron-700.woff2',
  },
  // Poppins 300 Light (for font-light usage)
  {
    name: 'poppins-300',
    url: 'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLDz8V1tvFP-KUEg.woff2',
    filename: 'poppins-300.woff2',
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirects
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    file.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('\n🔤 Downloading self-hosted fonts...\n');
  
  // Create fonts directory
  if (!existsSync(FONTS_DIR)) {
    mkdirSync(FONTS_DIR, { recursive: true });
    console.log(`  📁 Created ${FONTS_DIR}\n`);
  }

  for (const font of FONTS) {
    const dest = join(FONTS_DIR, font.filename);
    
    if (existsSync(dest)) {
      console.log(`  ⏭️  Skipping (exists): ${font.filename}`);
      continue;
    }
    
    try {
      process.stdout.write(`  ⬇️  Downloading ${font.filename}...`);
      await downloadFile(font.url, dest);
      console.log(' ✅');
    } catch (err) {
      console.log(` ❌ Error: ${err.message}`);
    }
  }
  
  console.log('\n✨ Font download complete!');
  console.log('📝 Self-hosted @font-face declarations are in src/index.css\n');
}

main().catch(console.error);
