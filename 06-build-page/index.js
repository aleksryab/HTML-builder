const path = require('path');
const { mkdir, readdir, readFile, appendFile, writeFile, copyFile, rm } = require('fs/promises');


const distPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const assetsSourcePath = path.join(__dirname, 'assets');
const assetsDistPath = path.join(distPath, 'assets');
const stylesSourcePath = path.join(__dirname, 'styles');
const stylesBundlePath = path.join(distPath, 'style.css');

async function buildHtml() {
  try {
    const template = await readFile(templatePath, {encoding: 'utf-8'});
    const componentRegExp = /{{(.*)}}/g;
    const componentsNames = template.match(componentRegExp).map(name => name.replace(/[{}]/g, ''));

    const components = [];
    for (const name of componentsNames) {
      const component = await readFile(path.join(componentsPath, `${name}.html`), {encoding: 'utf-8'});
      components.push(component);
    }

    const html = template.replace(componentRegExp, () => components.shift());
    await writeFile(path.join(distPath, 'index.html'), html, {encoding: 'utf-8'});

    console.log('HTML done...');
  } catch (error) {
    console.error(error);
  }
}

async function buildCss() {
  try {
    const files = await readdir(stylesSourcePath);
    const styles = files.filter(file => path.extname(file) === '.css');

    await rm(stylesBundlePath, {force: true});

    for (const style of styles) {
      const stylePath = path.join(stylesSourcePath, style);
      const data = await readFile(stylePath, {encoding: 'utf-8'});
      await appendFile(stylesBundlePath, data, {encoding: 'utf-8'});
    }

    console.log('CSS done...');
  } catch (error) {
    console.error(error);
  }
}

async function copyDir(sourceDir, distDir) {
  try {
    const dirInfo = await readdir(sourceDir, {withFileTypes: true});
    await mkdir(distDir);

    for (const item of dirInfo) {
      const itemSourcePath = path.join(sourceDir, item.name);
      const itemDistPath = path.join(distDir, item.name);

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

async function copyAssets() {
  await copyDir(assetsSourcePath, assetsDistPath);
  console.log('Assets copied...');
}

async function build() {
  console.log('Start build process...');

  await rm(distPath, {force: true, recursive: true});
  await mkdir(distPath, { recursive: true});
  await Promise.all([
    buildHtml(),
    buildCss(),
    copyAssets()
  ]);

  console.log('Build completed');
}

build();