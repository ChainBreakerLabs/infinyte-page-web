import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = process.argv[2] ?? 'assets/screens';
await mkdir('public/images/screens', { recursive: true });
await sharp(resolve(source, 'dashboard.jpeg'))
  .resize({ width: 828, withoutEnlargement: true })
  .webp({ quality: 88 })
  .toFile('public/images/dashboard.webp');
for (const name of ['accounts', 'budgets', 'debts', 'goals', 'planner', 'calendar']) {
  await sharp(resolve(source, `${name}.png`))
    .resize({ width: 828, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(`public/images/screens/${name}.webp`);
}
