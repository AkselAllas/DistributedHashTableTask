import * as fs from 'fs';
import Promise from 'bluebird';
import lineReader from 'line-reader';

const readPropertiesFromFile = async (path) => {
  if (!fs.existsSync(path)) {
    throw new Error(`Failed to read file: ${path}`);
  }
  const properties = {};
  let nextLine = '';
  const promisedEachLine = Promise.promisify(lineReader.eachLine);
  await promisedEachLine(path, (line) => {
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

export default readPropertiesFromFile;
