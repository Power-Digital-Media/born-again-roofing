const https = require('https');
const fs = require('fs');
const path = require('path');

const query = encodeURIComponent("Born Again Home Remodeling and Roofing Pearl MS");
const url = `https://www.google.com/maps/search/${query}`;

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
  }
};

console.log(`Requesting Google Maps search for: ${query}...`);

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const scratchDir = path.join(__dirname, 'scratch');
    const htmlPath = path.join(scratchDir, 'maps_results_pearl.html');
    fs.writeFileSync(htmlPath, data);
    console.log(`Saved Maps HTML to ${htmlPath}`);

    // Regex check
    const placeIdRegex = /ChI[A-Za-z0-9_-]{24}/g;
    const matches = data.match(placeIdRegex);
    if (matches) {
      console.log('Found Place IDs:', [...new Set(matches)]);
    } else {
      console.log('No Place IDs found. Searching for hex CIDs...');
      const hexRegex = /0x[0-9a-f]{15,16}/gi;
      const hexMatches = data.match(hexRegex);
      console.log('Hex matches:', hexMatches ? [...new Set(hexMatches)].slice(0, 10) : 'None');
    }
  });
}).on('error', (err) => {
  console.error('Error fetching Google Maps page:', err);
});
