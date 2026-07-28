const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'scratch', 'search_results.html');
const data = fs.readFileSync(htmlPath, 'utf8');

console.log('HTML size:', data.length);

// Check if "Born Again" is in the HTML
const occurrences = [];
let pos = data.indexOf('Born Again');
while (pos !== -1) {
  occurrences.push(pos);
  pos = data.indexOf('Born Again', pos + 1);
}

console.log(`Found ${occurrences.length} occurrences of "Born Again"`);

// Print snippets of the first 5 occurrences
occurrences.slice(0, 5).forEach((idx, i) => {
  console.log(`\n--- Occurrence ${i + 1} (index ${idx}) ---`);
  console.log(data.substring(Math.max(0, idx - 100), Math.min(data.length, idx + 150)));
});
