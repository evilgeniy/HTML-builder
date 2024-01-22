const fsPromises = require('fs').promises;
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const destinationPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.rm(destinationPath, { force: true, recursive: true });

    await fsPromises.mkdir(destinationPath, { recursive: true });

    const files = await fsPromises.readdir(sourcePath, { withFileTypes: true });

    for (const file of files) {
      const fileStartPath = path.join(sourcePath, file.name);
      const fileDestinationPath = path.join(destinationPath, file.name);
      await fsPromises.copyFile(fileStartPath, fileDestinationPath);
    }

    console.log('Directory copied successfully.');
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

copyDir();