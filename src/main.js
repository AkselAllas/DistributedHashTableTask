#!/usr/bin/env node
import * as fs from 'fs';
import Promise from 'bluebird';
import lineReader from 'line-reader';

const readPropertiesFromInputArgs = async () => {
  if (!fs.existsSync(process.argv[2])) {
    throw new Error(`Failed to read file: ${process.argv[2]}`);
  }
  const properties = {};
  let nextLine = '';
  const promisedEachLine = Promise.promisify(lineReader.eachLine);
  await promisedEachLine(process.argv[2], (line) => {
    if (nextLine !== '') {
      properties[nextLine] = line.split(',');
      nextLine = '';
    }
    if (line.includes('#key-space')) {
      nextLine = 'keySpace';
    }
    if (line.includes('#nodes')) {
      nextLine = 'nodes';
    }
    if (line.includes('shortcuts')) {
      nextLine = 'shortcuts';
    }
  });
  return properties;
};

const main = async () => {
  const properties = await readPropertiesFromInputArgs();
  console.log(properties);
};

try {
  main();
} catch (e) {
  console.error('\x1b[31m', e);
  process.exit(1);
}
