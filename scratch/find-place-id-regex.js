const https = require('https');

const query = encodeURIComponent("Born Again Home Remodeling & Roofing, LLC Florence MS");
const url = `https://www.google.com/maps/search/${query}`;

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
  }
};

console.log(`Searching Google Maps for: ${query}...`);

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Regex for Google Place ID: starts with ChI followed by 24 characters
    const placeIdRegex = /ChI[A-Za-z0-9_-]{24}/g;
    const matches = data.match(placeIdRegex);
    
    if (matches) {
      console.log('--- FOUND PLACE IDS ---');
      console.log([...new Set(matches)]);
    } else {
      console.log('No Place IDs matching ChI[A-Za-z0-9_-]{24} found in the HTML response.');
      // Print first 500 characters of the body to see if it is a captcha page
      console.log('HTML preview:');
      console.log(data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('Error fetching Google Maps page:', err);
});
