const https = require('https');
const fs = require('fs');
const path = require('path');

const query = encodeURIComponent("Born Again Home Remodeling & Roofing, LLC Florence MS");
const url = `https://www.google.com/maps/search/${query}`;

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const scratchDir = path.join(__dirname, 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir);
    }
    const htmlPath = path.join(scratchDir, 'maps_results.html');
    fs.writeFileSync(htmlPath, data);
    console.log(`Saved Maps HTML to ${htmlPath}`);
  });
}).on('error', (err) => {
  console.error('Error fetching Google Maps page:', err);
});
