const fs = require('fs');
const https = require('https');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'img');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode >= 400) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
      file.on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }).on('error', reject);
  });
}

const map = [
  { file: 'farm-hero.jpg', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&q=80' },
  { file: 'farm-1.jpg', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80' }
];

async function run() {
  for (const item of map) {
    const localPath = path.join(imgDir, item.file);
    console.log(`Downloading ${item.file}...`);
    try {
      await download(item.url, localPath);
      console.log(`Success: ${item.file}`);
    } catch (err) {
      console.error(`Failed to download ${item.file}:`, err.message);
    }
  }
}

run();
