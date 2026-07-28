const https = require('https');
const fs = require('fs');
const path = require('path');

const query = encodeURIComponent("Born Again Home Remodeling and Roofing Pearl MS");
const url = `https://www.google.com/search?q=${query}&hl=en`;

// Mobile User-Agent to force Google to return a simple static HTML page
const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }
};

console.log(`Requesting Google Mobile Search for: ${query}...`);

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const scratchDir = path.join(__dirname, 'scratch');
    const htmlPath = path.join(scratchDir, 'mobile_search.html');
    fs.writeFileSync(htmlPath, data);
    console.log(`Saved Mobile Search HTML to ${htmlPath}`);

    // Check if "Born Again" is in the HTML
    const index = data.indexOf('Born Again');
    if (index !== -1) {
      console.log(`Found "Born Again" in mobile search HTML at index ${index}!`);
      // Search for any href links containing maps or write a review
      const links = [];
      const linkRegex = /href="([^"]+)"/g;
      let match;
      while ((match = linkRegex.exec(data)) !== null) {
        const link = match[1];
        if (link.includes('maps') || link.includes('cid') || link.includes('lrd') || link.includes('ludocid')) {
          links.push(link);
        }
      }
      console.log('--- FOUND MAPS/REVIEW LINKS ---');
      console.log([...new Set(links)]);
    } else {
      console.log('"Born Again" not found in mobile search HTML.');
      console.log('HTML start:');
      console.log(data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error fetching Google Mobile Search:', err);
});
