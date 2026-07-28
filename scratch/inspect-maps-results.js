const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'scratch', 'maps_results.html');
const data = fs.readFileSync(htmlPath, 'utf8');

console.log('Maps HTML size:', data.length);

const keywords = ['Highland', 'Florence', 'Born Again', '573-6178'];

keywords.forEach(keyword => {
  const occurrences = [];
  let pos = data.indexOf(keyword);
  while (pos !== -1) {
    occurrences.push(pos);
    pos = data.indexOf(keyword, pos + 1);
  }
  console.log(`Keyword "${keyword}": found ${occurrences.length} times`);
  
  if (occurrences.length > 0) {
    console.log(`Context for first occurrence of "${keyword}":`);
    const start = Math.max(0, occurrences[0] - 200);
    const end = Math.min(data.length, occurrences[0] + 300);
    console.log(data.substring(start, end));
    console.log('------------------------------');
  }
});
