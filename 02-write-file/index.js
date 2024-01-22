const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile, { flags: 'a' }); 

process.on('exit', () => {
  stdout.write('Good luck.Bye\n'); 
});

process.on('SIGINT', () => {
  stdout.write('\nGood luck.Bye\n'); 
  process.exit();
});

stdout.write('Hello. Enter some information:\n');

stdin.on('data', (chunk) => {
  const input = chunk.toString().trim(); 
  if (input.toLowerCase() === 'exit') process.exit();
  output.write(input + '\n');
});