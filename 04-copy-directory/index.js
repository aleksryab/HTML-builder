const path = require('path');
const { mkdir, unlink, readdir, copyFile } = require('fs/promises');

const originFolderName = 'files';
const pathToOriginFolder = path.join(__dirname, originFolderName);
const pathToCopyFolder = path.join(__dirname, `${originFolderName}-copy`);

async function clearDir(pathToDir) {
  const files = await readdir(pathToDir);
  for (const file of files) {
    await unlink(path.join(pathToDir, file));
  }
}

async function copyDir(pathToOriginDir, pathToCopyDir) {
  try {
    await mkdir(pathToCopyDir, { recursive: true});
    await clearDir(pathToCopyDir);

    const files = await readdir(pathToOriginDir);
    files.forEach(file => {
      const originFilePath = path.join(pathToOriginDir, file);
      const copyFilePath = path.join(pathToCopyDir, file);
      copyFile(originFilePath, copyFilePath);
    });

    console.log('Dir is copied');

  } catch(err) {
    console.error(err);
  }
}

copyDir(pathToOriginFolder, pathToCopyFolder);
