const https = require('https');
const fs = require('fs');
const path = require('path');

const query = encodeURIComponent("Born Again Home Remodeling & Roofing, LLC Florence MS");
const url = `https://www.google.com/search?q=${query}&hl=en`;

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Write HTML to scratch directory for inspection
    const scratchDir = path.join(__dirname, 'scratch');
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir);
    }
    const htmlPath = path.join(scratchDir, 'search_results.html');
    fs.writeFileSync(htmlPath, data);
    console.log(`Saved HTML to ${htmlPath}`);

    // Try finding ludocid, placeid, or lrd in the HTML
    const lrdMatches = data.match(/lrd=([0-9a-f:x,]+)/gi);
    const placeIdMatches = data.match(/placeid=([A-Za-z0-9_-]+)/gi);
    const dataFidMatches = data.match(/data-fid="([0-9]+)"/gi);
    const dataLudoCidMatches = data.match(/data-ludocid="([0-9]+)"/gi);
    const mapsMatches = data.match(/google\.com\/maps\/place\/[^"'\s]+/gi);

    console.log('--- Search Results ---');
    console.log('lrd matches:', lrdMatches ? [...new Set(lrdMatches)] : 'None');
    console.log('placeid matches:', placeIdMatches ? [...new Set(placeIdMatches)] : 'None');
    console.log('data-fid matches:', dataFidMatches ? [...new Set(dataFidMatches)] : 'None');
    console.log('data-ludocid matches:', dataLudoCidMatches ? [...new Set(dataLudoCidMatches)] : 'None');
    console.log('maps links:', mapsMatches ? [...new Set(mapsMatches)].slice(0, 5) : 'None');
  });
}).on('error', (err) => {
  console.error('Error fetching Google Search page:', err);
});
