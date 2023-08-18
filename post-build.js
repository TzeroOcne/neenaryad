import { blueBright, greenBright, magentaBright } from 'colorette';
import fs from 'fs';
import { basename, dirname, extname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildPath = join(__dirname, 'build');

// Recursive function to process files and directories
function processFileOrDirectory(itemPath) {
  const stats = fs.statSync(itemPath);
  const itemName = basename(itemPath);

  if (stats.isFile()) {
    const fileExtension = extname(itemPath);
    
    if (fileExtension === '.html' && itemName !== 'index.html') {
      const directoryName = basename(itemPath, fileExtension);
      const parentDirectory = dirname(itemPath);
      const newDirectoryPath = join(parentDirectory, directoryName);

      if (!fs.existsSync(newDirectoryPath)) {
        fs.mkdirSync(newDirectoryPath);
      }

      const newIndexFilePath = join(newDirectoryPath, 'index.html');
      fs.renameSync(itemPath, newIndexFilePath);

      console.log(`${greenBright('Converted')}: ${magentaBright(relative(__dirname, itemPath))} -> ${blueBright(relative(__dirname, newIndexFilePath))}`);
    }
  } else if (stats.isDirectory() && itemName !== '_app') {
    const items = fs.readdirSync(itemPath);

    items.forEach(item => {
      const nestedItemPath = join(itemPath, item);
      processFileOrDirectory(nestedItemPath);
    });
  }
}

// Start processing files and directories in the build folder
console.log(greenBright('Starting post-build script...'));
processFileOrDirectory(buildPath);
console.log(greenBright('Post-build script completed.'));
