const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function bundleCSS() {
  const sourcePath = path.join(__dirname, 'styles');
  const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

  try {
    const files = await fs.promises.readdir(sourcePath, { withFileTypes: true });
    const writeStream = await fs.promises.open(bundleFile, 'w');

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(sourcePath, file.name);
        const fileExtension = path.extname(filePath);

        if (fileExtension === '.css') {
          const fileContent = await readFile(filePath, 'utf-8');
          await writeFile(bundleFile, fileContent, { flag: 'a' });
          console.log(`Bundled: ${file.name}`);
        }
      }
    }
    
    await writeStream.close();
    console.log('CSS bundling complete.');
  } catch (error) {
    console.error('Error bundling CSS:', error.message);
  }
}

bundleCSS();