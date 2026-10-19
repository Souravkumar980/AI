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

  // 3. Generate Standalone upload.html with jsDelivr CDN links
  await generateUploadHtml();
}

async function generateUploadHtml() {
  console.log('📦 Generating Standalone upload.html with jsDelivr CDN integration...');
  const assetsDir = path.join(distDir, 'assets');
  let jsFile = '';
  let cssFile = '';

  if (fs.existsSync(assetsDir)) {
    const assetFiles = fs.readdirSync(assetsDir);
    jsFile = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js')) || '';
    cssFile = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.css')) || '';
  }

  const cdnBase = 'https://cdn.jsdelivr.net/gh/Souravkumar980/dist@main';
  const jsUrl = jsFile ? `${cdnBase}/assets/${jsFile}` : `${cdnBase}/assets/index.js`;
  const cssUrl = cssFile ? `${cdnBase}/assets/${cssFile}` : `${cdnBase}/assets/index.css`;
  const faviconUrl = `${cdnBase}/favicon.png`;

  const uploadHtmlContent = `<!doctype html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5">
  <title>Exposed Propagandus | Bharat Mata ki Jai 🇮🇳</title>
  <meta name="description" content="Public database tracking anti-India propagandist influencers, political workers, and entities while celebrating patriotic nationalist creators. Bharat Mata ki Jai!">
  
  <!-- Open Graph / WhatsApp Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://exposedpropagandus.is-best.net/">
  <meta property="og:title" content="Exposed Propagandus | Bharat Mata ki Jai 🇮🇳">
  <meta property="og:description" content="Public watchdog tracking anti-India propagandists, foreign-funded narratives, and celebrating patriotic nationalist creators.">
  <meta property="og:image" content="https://cdn.jsdelivr.net/gh/Souravkumar980/dist@main/flag-of-india.png">
  <meta property="og:image:secure_url" content="https://cdn.jsdelivr.net/gh/Souravkumar980/dist@main/flag-of-india.png">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Exposed Propagandus">

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://exposedpropagandus.is-best.net/">
  <meta name="twitter:title" content="Exposed Propagandus | Bharat Mata ki Jai 🇮🇳">
  <meta name="twitter:description" content="Public watchdog tracking anti-India propagandists, foreign-funded narratives, and celebrating patriotic nationalist creators.">
  <meta name="twitter:image" content="https://cdn.jsdelivr.net/gh/Souravkumar980/dist@main/flag-of-india.png">

  <link rel="icon" type="image/png" href="${faviconUrl}">
  <link rel="apple-touch-icon" href="${faviconUrl}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Bebas+Neue&family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" crossorigin href="${cssUrl}">
  <script>
    (function() {
      var CDN_BASE = '${cdnBase}';
      window.__CDN_BASE__ = CDN_BASE;
      window.__API_BASE_URL__ = '';
      window.__EP_CLIENT_KEY__ = 'ep-client-v1-bharat-first-2024';

      var staticAssets = ['/golden.png', '/blue.png', '/favicon.png', '/flag-of-india.png', '/flag-of-india-330.png', '/donate-qr.jpg'];
      var origSrcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
      if (origSrcDesc && origSrcDesc.set) {
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
          set: function(val) {
            if (typeof val === 'string') {
              for (var i = 0; i < staticAssets.length; i++) {
                if (val.startsWith(staticAssets[i])) {
                  return origSrcDesc.set.call(this, CDN_BASE + val);
                }
              }
            }
            return origSrcDesc.set.call(this, val);
          },
          get: origSrcDesc.get
        });
      }

      if (window.Audio) {
        var OrigAudio = window.Audio;
        window.Audio = function(src) {
          if (typeof src === 'string' && src.startsWith('/sounds/')) {
            src = CDN_BASE + src;
          }
          return new OrigAudio(src);
        };
        window.Audio.prototype = OrigAudio.prototype;
      }

      var origFetch = window.fetch;
      if (origFetch) {
        window.fetch = function(input, init) {
          init = init || {};
          var rawUrl = typeof input === 'string' ? input : (input instanceof Request ? input.url : '');
          var isThirdParty = rawUrl && (
            rawUrl.indexOf('giphy.com') !== -1 ||
            rawUrl.indexOf('youtube.com') !== -1 ||
            rawUrl.indexOf('country.is') !== -1 ||
            rawUrl.indexOf('dicebear.com') !== -1 ||
            rawUrl.indexOf('ui-avatars.com') !== -1
          );
          var isApiCall = !isThirdParty && rawUrl && (rawUrl.indexOf('/api') !== -1 || rawUrl.indexOf('api.php') !== -1);
          var finalInput = input;
          if (isApiCall) {
            try {
              var parsed = new URL(rawUrl, window.location.href);
              if (parsed.pathname.indexOf('/api/') !== -1) {
                var ep = parsed.pathname.substring(parsed.pathname.indexOf('/api/') + 5);
                parsed.pathname = '/api.php';
                if (ep) {
                  parsed.searchParams.set('endpoint', ep);
                }
              } else if (parsed.pathname.endsWith('/api') || parsed.pathname === '/api') {
                parsed.pathname = '/api.php';
              }
              if (!init.credentials) {
                init.credentials = 'same-origin';
              }
              var origMethod = (init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
              if (['PUT', 'PATCH', 'DELETE'].indexOf(origMethod) !== -1) {
                init.method = 'POST';
                parsed.searchParams.set('_method', origMethod);
              }
              if (!parsed.searchParams.has('key')) {
                parsed.searchParams.set('key', 'ep-client-v1-bharat-first-2024');
              }
              var adm = '';
              try { adm = localStorage.getItem('propagandus_admin_key') || localStorage.getItem('admin_token') || ''; } catch(e){}
              if (adm && (parsed.searchParams.get('endpoint') || '').indexOf('admin') === 0) {
                parsed.searchParams.set('adminKey', adm);
              }
              finalInput = parsed.toString();
            } catch(e) {}

            var headers = new Headers(init.headers || (input instanceof Request ? input.headers : {}));
            if (!headers.has('x-app-key')) {
              headers.set('x-app-key', 'ep-client-v1-bharat-first-2024');
            }
            var adminKey = '';
            try {
              adminKey = localStorage.getItem('propagandus_admin_key') || localStorage.getItem('admin_token') || '';
            } catch(e){}
            if (adminKey && !headers.has('x-admin-key')) {
              headers.set('x-admin-key', adminKey);
            }
            if (adminKey && !headers.has('authorization')) {
              headers.set('authorization', 'Bearer ' + adminKey);
            }
            init.headers = headers;
          }
          return origFetch.call(this, finalInput, init);
        };
      }
    })();
  </script>
  <script type="module" crossorigin src="${jsUrl}"></script>
</head>
<body class="bg-[#F8F9FA] text-black font-body antialiased selection:bg-saffron selection:text-black overflow-x-hidden min-h-screen">
  <div id="root"></div>
</body>
</html>`;

  const minifiedHtml = await minifyHtml(uploadHtmlContent, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true
  });

  // Security Cleaner: Ensure no database, PHP, or config files ever exist in dist/
  const sensitiveFiles = ['upload.sql', 'db_config.php', 'api.php', '.env', 'data.db'];
  for (const sf of sensitiveFiles) {
    const p = path.join(distDir, sf);
    if (fs.existsSync(p)) {
      try {
        fs.unlinkSync(p);
        console.log(`🛡️ Security Cleaner: Removed sensitive file from dist: ${sf}`);
      } catch (e) {}
    }
  }
  const backupDistPath = path.join(distDir, 'v7/admin/om/backup');
  if (fs.existsSync(backupDistPath)) {
    try {
      fs.rmSync(backupDistPath, { recursive: true, force: true });
      console.log('🛡️ Security Cleaner: Removed legacy backup dir from dist/v7/admin/om/backup');
    } catch (e) {}
  }

  const distUploadPath = path.join(distDir, 'upload.html');
  const rootUploadPath = path.resolve(__dirname, '../upload.html');
  const publicUploadPath = path.resolve(__dirname, '../public/upload.html');

  fs.writeFileSync(distUploadPath, minifiedHtml, 'utf8');
  fs.writeFileSync(rootUploadPath, minifiedHtml, 'utf8');
  fs.writeFileSync(publicUploadPath, minifiedHtml, 'utf8');
  console.log(`✅ Generated Standalone upload.html (${minifiedHtml.length} bytes) at:`);
  console.log(`   - ${distUploadPath}`);
  console.log(`   - ${rootUploadPath}`);
  console.log(`   - ${publicUploadPath}`);
}

runMinification().then(() => {
  console.log('🎉 Minification and obfuscation completed successfully.');
}).catch(err => {
  console.error('Error during minification:', err);
  process.exit(1);
});
