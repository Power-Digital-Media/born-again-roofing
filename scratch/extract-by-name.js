const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'scratch', 'maps_results.html');
const data = fs.readFileSync(htmlPath, 'utf8');

const targetStr = "Born Again Home Remodeling";
const index = data.indexOf(targetStr);
if (index === -1) {
  console.log(`String "${targetStr}" not found in HTML.`);
  process.exit(0);
}

console.log(`Found "${targetStr}" at index ${index}. Extracting context...`);

// Let's print 5000 characters starting from 1000 characters before the target
const start = Math.max(0, index - 1000);
const end = Math.min(data.length, index + 4000);
const context = data.substring(start, end);

// Write context to a file for review
const contextPath = path.join(__dirname, 'scratch', 'maps_context.txt');
fs.writeFileSync(contextPath, context);
console.log(`Saved context to ${contextPath}`);

// Let's do a regex search on this local context for Place IDs (ChI followed by 24 characters)
const placeIdRegex = /ChI[A-Za-z0-9_-]{24}/g;
const matches = context.match(placeIdRegex);
if (matches) {
  console.log('Found Place IDs in context:', [...new Set(matches)]);
} else {
  console.log('No Place IDs matching ChI[A-Za-z0-9_-]{24} found in context.');
}

// Let's search for hex CID coordinates (0x...:0x...)
const hexRegex = /0x[0-9a-f]+:0x[0-9a-f]+/gi;
const hexMatches = context.match(hexRegex);
if (hexMatches) {
  console.log('Found CID candidates in context:', [...new Set(hexMatches)]);
} else {
  console.log('No CID candidates found in context.');
}
