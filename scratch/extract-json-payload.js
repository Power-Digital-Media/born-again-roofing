const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'scratch', 'maps_results.html');
const data = fs.readFileSync(htmlPath, 'utf8');

const prefix = ")]}'\n";
const index = data.indexOf(prefix);
if (index === -1) {
  console.log('JSON prefix not found.');
  process.exit(0);
}

const jsonStart = index + prefix.length;
const jsonText = data.substring(jsonStart).trim();

// Write the JSON raw payload to a file for parsing/investigation
const payloadPath = path.join(__dirname, 'scratch', 'maps_payload.json');
fs.writeFileSync(payloadPath, jsonText);
console.log(`Saved raw JSON payload to ${payloadPath}`);

// Let's do a regex search on this JSON text for any Place ID or CID structures
const placeIdRegex = /ChI[A-Za-z0-9_-]{24}/g;
const matches = jsonText.match(placeIdRegex);
if (matches) {
  console.log('Found Place IDs inside the payload:', [...new Set(matches)]);
} else {
  console.log('No Place IDs matching ChI[A-Za-z0-9_-]{24} found inside the payload.');
}

// Let's find hex numbers starting with 0x (Google CIDs are usually in hex format like 0x88647087cb3d4b6b:0x39a04f2f01f8ee88)
const cidHexRegex = /0x[0-9a-f]+:0x[0-9a-f]+/gi;
const cidMatches = jsonText.match(cidHexRegex);
if (cidMatches) {
  console.log('Found CID candidates inside the payload:', [...new Set(cidMatches)]);
} else {
  console.log('No CID candidates found.');
}
