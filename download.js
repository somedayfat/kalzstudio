const fs = require('fs');
const https = require('https');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'img');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
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

(async () => {
  const files = ['index.html', 'sample-1.html', 'sample-2.html', 'sample-3.html'];
  const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+[^"'\s\)]*/g;
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    let match;
    const urls = new Set();
    while ((match = regex.exec(content)) !== null) {
      urls.add(match[0]);
    }
    
    if (urls.size === 0) continue;
    
    for (const url of urls) {
      try {
        const idMatch = url.match(/photo-([a-zA-Z0-9\-]+)/);
        if (idMatch) {
          const id = idMatch[1].substring(0, 12); 
          const localName = `unsplash-${id}.jpg`;
          const localPath = path.join(imgDir, localName);
          
          if (!fs.existsSync(localPath)) {
            console.log(`Downloading ${localName}...`);
            await download(url, localPath);
          }
          
          content = content.split(url).join(`assets/img/${localName}`);
        }
      } catch (e) {
        console.error(`Failed to download ${url}`, e);
      }
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
})();
