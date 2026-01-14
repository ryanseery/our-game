import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

const basePath = '/our-game';
const distDir = join(import.meta.dir, '..', 'dist');

function fixHtmlFile(filePath: string) {
  let content = readFileSync(filePath, 'utf8');

  // Fix script and link tags to include base path
  content = content.replace(/src="\/_expo/g, `src="${basePath}/_expo`);
  content = content.replace(/href="\/_expo/g, `href="${basePath}/_expo`);
  content = content.replace(/href="\/assets/g, `href="${basePath}/assets`);

  writeFileSync(filePath, content);
  console.log(`Fixed paths in ${basename(filePath)}`);
}

// Find and fix all HTML files
function fixAllHtmlFiles(dir: string) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      fixAllHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      fixHtmlFile(filePath);
    }
  });
}

fixAllHtmlFiles(distDir);
console.log('All paths fixed!');
