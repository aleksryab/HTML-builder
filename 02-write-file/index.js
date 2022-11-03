const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const pathTofFile = path.join(__dirname, 'output.txt');
const output = fs.createWriteStream(pathTofFile, 'utf-8');

const leave = () => {
  stdout.write('\nGood luck with your learning!');
  process.exit();
};

stdout.write('Hi! Write your message:\n');
stdin.on('data', data => {
  const dataStringified = data.toString();
  if(dataStringified.trim() === 'exit') leave();
  output.write(dataStringified);
});

process.on('SIGINT', leave);