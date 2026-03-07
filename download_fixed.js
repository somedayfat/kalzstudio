const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const imgDir = path.join(__dirname, 'assets', 'img');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const map = [
  { file: 'ac-hero.jpg', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80', replaces: 'assets/img/unsplash-1558227691-4.jpg' },
  { file: 'ac-1.jpg', url: 'https://images.unsplash.com/photo-1598448937989-130612cebd39?w=600&q=80', replaces: 'assets/img/unsplash-159844893798.jpg' },
  { file: 'ac-2.jpg', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80', replaces: 'assets/img/unsplash-162190525118.jpg' },
  { file: 'ac-3.jpg', url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80', replaces: 'assets/img/unsplash-158109216056.jpg' },

  { file: 'b2b-hero.jpg', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80', replaces: 'assets/img/unsplash-154188808169.jpg' },
  { file: 'b2b-1.jpg', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80', replaces: 'assets/img/unsplash-151870926880.jpg' },
  { file: 'b2b-2.jpg', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&q=80', replaces: 'assets/img/unsplash-159049679390.jpg' },
  { file: 'b2b-3.jpg', url: 'https://images.unsplash.com/photo-1517646287270-a569ca5e9821?w=600&q=80', replaces: 'assets/img/unsplash-162161642953.jpg' },
  { file: 'b2b-4.jpg', url: 'https://images.unsplash.com/photo-1533550186718-47acbf3089bd?w=600&q=80', replaces: 'assets/img/unsplash-152069969785.jpg' },

  { file: 'print-hero.jpg', url: 'https://images.unsplash.com/photo-1622480371302-601614271810?w=800&q=80', replaces: 'assets/img/unsplash-1562564055-7.jpg' },
  { file: 'print-1.jpg', url: 'https://images.unsplash.com/photo-1614036417651-1d051c51d7c3?w=600&q=80', replaces: 'assets/img/unsplash-161403641765.jpg' },
  { file: 'print-2.jpg', url: 'https://images.unsplash.com/photo-1572044162444-ad60f128e441?w=600&q=80', replaces: 'assets/img/unsplash-157976259317.jpg' },
  { file: 'print-3.jpg', url: 'https://images.unsplash.com/photo-1542644464-9f44fd31cde3?w=600&q=80', replaces: 'assets/img/unsplash-1542644464-9.jpg' },
  { file: 'print-4.jpg', url: 'https://images.unsplash.com/photo-1627885023908-1660d5dd70a7?w=600&q=80', replaces: 'assets/img/unsplash-162788502390.jpg' },

  { file: 'hero-1.jpg', url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80', replaces: 'assets/img/unsplash-1556742049-0.jpg' },
  { file: 'hero-2.jpg', url: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=500&q=80', replaces: 'assets/img/unsplash-157380463392.jpg' },
  { file: 'hero-3.jpg', url: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=500&q=80', replaces: 'assets/img/unsplash-1558655146-3.jpg' }
];

async function run() {
  for (const item of map) {
    const localPath = path.join(imgDir, item.file);
    console.log(`Downloading ${item.file}...`);
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
      const fileStream = fs.createWriteStream(localPath);
      await pipeline(res.body, fileStream);
    } catch (err) {
      console.error(`Failed to download ${item.file}:`, err.message);
    }
  }

  const htmlFiles = ['index.html', 'sample-1.html', 'sample-2.html', 'sample-3.html'];
  for (const htmlFile of htmlFiles) {
    const p = path.join(__dirname, htmlFile);
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf8');
      let changed = false;
      for (const item of map) {
        const replacement = `assets/img/${item.file}`;
        if (content.includes(item.replaces)) {
          content = content.split(item.replaces).join(replacement);
          changed = true;
        }
        // In case they were never replaced from URLs
        if (content.includes(item.url)) {
          content = content.split(item.url).join(replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(p, content, 'utf8');
        console.log(`Updated references in ${htmlFile}`);
      }
    }
  }
}

run();
