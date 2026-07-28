const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'scratch', 'search_results.html');
const data = fs.readFileSync(htmlPath, 'utf8');

// Find all URLs or elements containing maps, google.com/maps, or maps.google.com
const regexList = [
  /google\.com\/maps[^\s"']+/gi,
  /maps\.google\.com[^\s"']+/gi,
  /data-fid="([0-9a-f:x]+)"/gi,
  /data-cid="([0-9a-f:x]+)"/gi,
  /data-ludocid="([0-9a-f:x]+)"/gi,
  /ludocid=([0-9a-f:x]+)/gi,
  /kgmid=([^\s"']+)*/gi,
  /lrd=([^\s"']+)*/gi
];

console.log('Searching HTML for Google Maps keys...');

regexList.forEach((regex, i) => {
  const matches = data.match(regex);
  console.log(`Regex ${i + 1} (${regex.toString()}):`, matches ? [...new Set(matches)].slice(0, 10) : 'None');
});
