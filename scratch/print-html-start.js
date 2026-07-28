const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'scratch', 'search_results.html');
const data = fs.readFileSync(htmlPath, 'utf8');

console.log('HTML size:', data.length);
console.log('Start of HTML:');
console.log(data.substring(0, 1500));
