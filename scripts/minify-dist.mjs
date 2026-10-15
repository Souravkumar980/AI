import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify as minifyHtml } from 'html-minifier-terser';
import CleanCSS from 'clean-css';
import { minify as minifyJs } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

async function runMinification() {
  console.log('⚡ Starting High-Performance Minification & Obfuscation on dist/...');
  if (!fs.existsSync(distDir)) {
    console.error('dist directory does not exist! Please run vite build first.');
    process.exit(1);
  }

  // 1. Minify HTML files
  const htmlFiles = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));
  for (const f of htmlFiles) {
    const fullPath = path.join(distDir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    const minified = await minifyHtml(content, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true
    });
    fs.writeFileSync(fullPath, minified, 'utf8');
    console.log(`✅ Minified HTML: ${f} (${content.length}B -> ${minified.length}B)`);
  }

  // 2. Minify CSS files
  const cleanCss = new CleanCSS({
    level: 2,
    compatibility: '*'
  });

  async function processDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processDir(fullPath);
      } else if (entry.name.endsWith('.css')) {
        const cssContent = fs.readFileSync(fullPath, 'utf8');
        const output = cleanCss.minify(cssContent);
        if (output.styles) {
          fs.writeFileSync(fullPath, output.styles, 'utf8');
          console.log(`✅ Minified CSS: ${entry.name} (${cssContent.length}B -> ${output.styles.length}B)`);
        }
      } else if (entry.name.endsWith('.js') && !entry.name.includes('sw.')) {
        const jsContent = fs.readFileSync(fullPath, 'utf8');
        try {
          const result = await minifyJs(jsContent, {
            compress: {
              dead_code: true,
              drop_console: true,
              drop_debugger: true,
              passes: 2
            },
            mangle: {
              toplevel: true
            },
            format: {
              comments: false
            }
          });
          if (result.code) {
            fs.writeFileSync(fullPath, result.code, 'utf8');
            console.log(`✅ Minified & Obfuscated JS: ${entry.name} (${jsContent.length}B -> ${result.code.length}B)`);
          }
        } catch (err) {
          console.warn(`Warning minifying ${entry.name}:`, err.message);
        }
      }
    }
  }

  await processDir(distDir);
}

runMinification().then(() => {
  console.log('🎉 Minification and obfuscation completed successfully.');
}).catch(err => {
  console.error('Error during minification:', err);
  process.exit(1);
});
