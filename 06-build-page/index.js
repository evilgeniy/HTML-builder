const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const projectFolder = 'project-dist';

async function createFolder() {
  try {
    const destinationPath = path.join(__dirname, projectFolder);
    const assetsSourcePath = path.join(__dirname, 'assets');
    const assetsDestinationPath = path.join(__dirname, projectFolder, 'assets');

    await fsPromises.mkdir(destinationPath, { recursive: true });

    await bundleHTML();
    await bundleStyles();
    await copyDir(assetsSourcePath, assetsDestinationPath);

    console.log('Project folder created successfully.');
  } catch (error) {
    console.error('Error creating project folder:', error.message);
  }
}

async function bundleHTML() {
  try {
    const pathToTemplateFile = path.join(__dirname, 'template.html');
    const pathToComponentsFolder = path.join(__dirname, 'components');
    const pathToHTMLFile = path.join(__dirname, projectFolder, 'index.html');

    await copyMainFile(pathToTemplateFile, pathToHTMLFile);
    let HTMLfile = await fsPromises.readFile(pathToHTMLFile, 'utf-8');
    const components = await fsPromises.readdir(pathToComponentsFolder, {
      withFileTypes: true,
    });

    const newHTML = await replaceTags(
      HTMLfile,
      components,
      pathToComponentsFolder,
    );
    await fsPromises.writeFile(pathToHTMLFile, newHTML);

    console.log('HTML bundled successfully.');
  } catch (error) {
    console.error('Error bundling HTML:', error.message);
  }
}

async function copyMainFile(pathToFile, bundleFile) {
  try {
    const content = await fsPromises.readFile(pathToFile, 'utf-8');
    await fsPromises.writeFile(bundleFile, content);

    console.log('Main file copied successfully.');
  } catch (error) {
    console.error('Error copying main file:', error.message);
  }
}

async function replaceTags(HTMLfile, files, pathDir) {
  try {
    for (let i = 0; i < files.length; i += 1) {
      const filePath = path.join(pathDir, files[i].name);
      if (files[i].isFile() && path.extname(filePath) === '.html') {
        const fileName = files[i].name.slice(0, files[i].name.lastIndexOf('.'));
        const fileData = await fsPromises.readFile(filePath, 'utf-8');
        HTMLfile = HTMLfile.replace(`{{${fileName}}}`, fileData);
      }
    }
    return HTMLfile;

    console.log('Tags replaced successfully.');
  } catch (error) {
    console.error('Error replacing tags:', error.message);
  }
}

async function bundleStyles() {
  try {
    const sourcePath = path.join(__dirname, 'styles');
    const bundleFile = path.join(__dirname, projectFolder, 'style.css');

    const files = await fsPromises.readdir(sourcePath, { withFileTypes: true });

    const writeStream = fs.createWriteStream(bundleFile);

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(sourcePath, file.name);
        const fileExtension = path.extname(filePath);
        if (fileExtension === '.css') {
          const readStream = fs.createReadStream(filePath, 'utf-8');

          readStream.pipe(writeStream);
        }
      }
    }

    console.log('Styles bundled successfully.');
  } catch (error) {
    console.error('Error bundling styles:', error.message);
  }
}

async function copyDir(sourcePath, destinationPath) {
  try {
    await fsPromises.mkdir(destinationPath, { recursive: true });
    const files = await fsPromises.readdir(sourcePath, { withFileTypes: true });

    for (const file of files) {
      const fileStartPath = path.join(sourcePath, file.name);
      const fileDestinationPath = path.join(destinationPath, file.name);
      if (file.isDirectory()) {
        await copyDir(fileStartPath, fileDestinationPath);
      } else {
        await fsPromises.copyFile(fileStartPath, fileDestinationPath);
      }
    }

    console.log('Directory copied successfully.');
  } catch (error) {
    console.error('Error copying directory:', error.message);
  }
}

createFolder();