const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const imgDir = path.join(__dirname, 'assets', 'img');

const map = [
  { file: 'farm-hero.jpg', url: 'https://images.unsplash.com/photo-1595841696677-1d5d1c238b6d?w=1000&q=80' },
  { file: 'farm-1.jpg', url: 'https://images.unsplash.com/photo-1518991206-8ae4dbeb169f?w=600&q=80' },
  { file: 'farm-2.jpg', url: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=600&q=80' },
  { file: 'farm-3.jpg', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80' },
  { file: 'farm-4.jpg', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80' },
  { file: 'farm-5.jpg', url: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=600&q=80' }
];

async function run() {
  for (const item of map) {
    const localPath = path.join(imgDir, item.file);
    console.log(`Downloading ${item.file}...`);
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) throw new Error(`Status HTTP ${res.status}`);
      const fileStream = fs.createWriteStream(localPath);
      await pipeline(res.body, fileStream);
    } catch (err) {
      console.error(`Failed to download ${item.file}:`, err.message);
    }
  }
}

run();
