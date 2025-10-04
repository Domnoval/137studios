import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

const artworkDir = './public/artwork';
const files = await readdir(artworkDir);

console.log('🎨 Optimizing artwork images...\n');

for (const file of files) {
  if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

  const inputPath = join(artworkDir, file);
  const outputPath = join(artworkDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

  try {
    const metadata = await sharp(inputPath).metadata();
    const sizeMB = (metadata.size / 1024 / 1024).toFixed(2);

    console.log(`📸 ${file} (${sizeMB}MB)`);

    await sharp(inputPath)
      .resize(2000, 2000, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const newMetadata = await sharp(outputPath).metadata();
    const newSizeMB = (newMetadata.size / 1024 / 1024).toFixed(2);
    const savings = ((1 - newMetadata.size / metadata.size) * 100).toFixed(1);

    console.log(`   ✅ → ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')} (${newSizeMB}MB) - ${savings}% smaller\n`);
  } catch (error) {
    console.error(`   ❌ Error processing ${file}:`, error.message);
  }
}

console.log('✨ Done! All images optimized to WebP format.');
