const fs = require('fs');
const path = require('path');

const sourceFolderDir = path.join(__dirname, 'styles');
const targetDir = path.join(__dirname, 'project-dist', 'bundle.css');
const writeableStream = fs.createWriteStream(targetDir, 'utf8');

fs.readdir(sourceFolderDir, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error reading source folder:', err.message);
    return;
  }
  let processedFiles = 0;
  
  files.forEach((file) => {
    const filePath = path.join(sourceFolderDir, file.name);
    const fileExt = path.extname(filePath).slice(1);
    if (file.isFile() && fileExt.toLowerCase() === 'css') {
      const readStream = fs.createReadStream(filePath, 'utf8');
      readStream.on('error', (readErr) => {
        console.error(`Error reading file ${filePath}:`, readErr.message);
        processedFiles++;
        checkAllFilesProcessed();
      });
      readStream.pipe(writeableStream, { end: false });
      readStream.on('end', () => {
        processedFiles++;
        checkAllFilesProcessed();
      });
    }
  });

  function checkAllFilesProcessed() {
    if (processedFiles === files.length) {
      writeableStream.end();
    }
  }
});
