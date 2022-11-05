const path = require('path');
const { readdir, readFile, appendFile, rm } = require('fs/promises');

const sourcePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

(async () => {
  try {
    console.log('Start build process...');

    const files = await readdir(sourcePath);
    const styles = files.filter(file => path.extname(file) === '.css');

    await rm(bundlePath, {force: true});

    for (const style of styles) {
      const stylePath = path.join(sourcePath, style);
      const data = await readFile(stylePath, {encoding: 'utf-8'});
      await appendFile(bundlePath, data, {encoding: 'utf-8'});
    }

    console.log('Build completed');
  } catch (error) {
    console.error(error);
  }

})();
