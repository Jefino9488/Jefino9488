#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts PNG/JPG images to WebP format for the portfolio.
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, basename, extname } from 'path';

const PUBLIC_DIR = new URL('../public', import.meta.url).pathname;

const IMAGE_TASKS = [
  // Profile images
  {
    input: 'profile/banner.jpg',
    output: 'profile/banner.webp',
    width: 800,
    quality: 80,
    outputOriginal: true, // Keep original as fallback
  },
  {
    input: 'profile/profile.jpg',
    output: 'profile/profile.webp',
    width: 256,
    quality: 85,
    outputOriginal: true,
  },
  {
    input: 'profile/profile_anime.jpg',
    output: 'profile/profile_anime.webp',
    width: 512,
    quality: 85,
    outputOriginal: true,
  },
  // Static assets
  {
    input: 'og-image.png',
    output: 'og-image.webp',
    width: 1200,
    quality: 80,
    outputOriginal: true,
  },
  {
    input: 'logo-new.png',
    output: 'logo-new.webp',
    width: 512,
    quality: 90,
    outputOriginal: true,
  },
  // Project banners
  {
    input: 'frameworkpatcher_banner.png',
    output: 'frameworkpatcher_banner.webp',
    width: 1200,
    quality: 80,
    outputOriginal: true,
  },
  {
    input: 'litm_analyzer_banner.png',
    output: 'litm_analyzer_banner.webp',
    width: 1200,
    quality: 80,
    outputOriginal: true,
  },
  // Certificates – lightly compress, modest quality to preserve text
  {
    input: 'certificates/CCNA1-1.jpg',
    output: 'certificates/CCNA1-1.webp',
    quality: 82,
    outputOriginal: true,
  },
  {
    input: 'certificates/CCNA2-1.jpg',
    output: 'certificates/CCNA2-1.webp',
    quality: 82,
    outputOriginal: true,
  },
  {
    input: 'certificates/CCNA3-1.jpg',
    output: 'certificates/CCNA3-1.webp',
    quality: 82,
    outputOriginal: true,
  },
  {
    input: 'certificates/PE1-1.jpg',
    output: 'certificates/PE1-1.webp',
    quality: 82,
    outputOriginal: true,
  },
  {
    input: 'certificates/PE2-1.jpg',
    output: 'certificates/PE2-1.webp',
    quality: 82,
    outputOriginal: true,
  },
];

async function optimizeImage({ input, output, width, quality, outputOriginal }) {
  const inputPath = join(PUBLIC_DIR, input);
  const outputPath = join(PUBLIC_DIR, output);

  if (!existsSync(inputPath)) {
    console.warn(`  ⚠️  Skipping (not found): ${input}`);
    return;
  }

  // Ensure output directory exists
  const outputDir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const originalSize = statSync(inputPath).size;
  
  try {
    let pipeline = sharp(inputPath);
    
    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
    }
    
    await pipeline
      .webp({ quality: quality || 80, effort: 6 })
      .toFile(outputPath);

    const newSize = statSync(outputPath).size;
    const saving = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
    console.log(`  ✅ ${input}`);
    console.log(`     ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${saving}% saved)`);
  } catch (err) {
    console.error(`  ❌ Error processing ${input}:`, err.message);
  }
}

async function main() {
  console.log('\n🖼️  Starting image optimization...\n');

  for (const task of IMAGE_TASKS) {
    await optimizeImage(task);
  }

  console.log('\n✨ Image optimization complete!\n');
  console.log('💡 Update <picture> elements in components to use .webp sources with .jpg/.png fallbacks.');
}

main().catch(console.error);
