const { register } = require('ts-node');
const path = require('path');

const folderPath = process.argv[2];

if (!folderPath) {
  console.error('The pattern name was not provided');
  process.exit(1);
}

const tsFilePath = `./patterns/${folderPath}/main.ts`;

register();

try {
  require(tsFilePath);
} catch (error) {
  console.error(`Failed to run pattern example:`, error);
  process.exit(1);
}