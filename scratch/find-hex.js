const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'scratch', 'maps_results.html');
const data = fs.readFileSync(htmlPath, 'utf8');

// Match hex patterns representing 64-bit hex IDs (15 to 16 characters long, e.g. 0x88647087cb3d4b6b)
const hexRegex = /0x[0-9a-f]{15,16}/gi;
const matches = data.match(hexRegex);

if (matches) {
  console.log('Found 64-bit Hex IDs:');
  const uniqueMatches = [...new Set(matches)];
  uniqueMatches.forEach(m => {
    // Print context of where it was found
    const pos = data.indexOf(m);
    console.log(`- ${m} (found at index ${pos})`);
    console.log(`  Context: ${data.substring(Math.max(0, pos - 50), Math.min(data.length, pos + 100))}`);
  });
} else {
  console.log('No 64-bit Hex IDs found.');
}
