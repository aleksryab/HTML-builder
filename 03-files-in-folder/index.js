const path = require('path');
const { readdir, stat } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

readdir(pathToFolder, { withFileTypes: true })
  .then(files => {

    files.forEach(file => {

      if(file.isFile()) {
        const pathToFile = path.join(pathToFolder, file.name);
        const name = path.parse(file.name).name;
        const ext = path.extname(file.name).replace('.', '');

        stat(pathToFile)
          .then(stats => console.log(`${name} - ${ext} - ${stats.size} bytes`))
          .catch(err => console.error(err));
      }

    });
  })
  .catch(err => {
    console.error(err);
  });

