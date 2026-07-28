const https = require('https');

const query = encodeURIComponent("Born Again Home Remodeling & Roofing, LLC");
const url = `https://www.google.com/maps/search/${query}`;

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
  }
};

console.log(`Requesting Google Maps search redirect for: ${query}...`);

https.get(url, options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // If redirected, the location header contains the URL
    if (res.headers.location) {
      console.log('Redirect Location:', res.headers.location);
    } else {
      console.log('No redirect header found. Searching HTML body for Place ID / CID...');
      // Search the HTML for maps place patterns: /maps/place/Name/@lat,lng,zoom/data=...
      const placeMatches = data.match(/google\.com\/maps\/place\/[^"'\s]+/gi);
      const hexMatches = data.match(/0x[0-9a-f]+:0x[0-9a-f]+/gi);
      console.log('Found maps place matches:', placeMatches ? [...new Set(placeMatches)].slice(0, 5) : 'None');
      console.log('Found hex matches (ludocid/CID halves):', hexMatches ? [...new Set(hexMatches)].slice(0, 5) : 'None');
    }
  });
}).on('error', (err) => {
  console.error('Error fetching Google Maps page:', err);
});
