const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathFile, { encoding: 'utf8' });

readStream.on('data', (chunk) => {
  if (chunk.trim() !== '') {
    console.log(chunk.trim());
  }
});

readStream.on('end', () => {
  console.log('Reading complete.');
});

readStream.on('error', (err) => {
  console.error('Error reading the file:', err);
});