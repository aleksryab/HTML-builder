const path = require('path');
const { mkdir, readdir, copyFile, rm } = require('fs/promises');

const originFolderName = 'files';
const pathToOriginFolder = path.join(__dirname, originFolderName);
const pathToCopyFolder = path.join(__dirname, `${originFolderName}-copy`);

async function copyDir(originDirPath, copyDirPath) {
  try {
    const dirInfo = await readdir(originDirPath, {withFileTypes: true});
    await mkdir(copyDirPath);

    for (const item of dirInfo) {
      const itemSourcePath = path.join(originDirPath, item.name);
      const itemDistPath = path.join(copyDirPath, item.name);

      if (item.isDirectory()) {
        await copyDir(itemSourcePath, itemDistPath);
      } else {
        await copyFile(itemSourcePath, itemDistPath);
      }
    }

  } catch(err) {
    console.error(err);
  }
}

(async () => {
  await rm(pathToCopyFolder, {force: true, recursive: true});
  await copyDir(pathToOriginFolder, pathToCopyFolder);
  console.log('Directory copied');
})();
