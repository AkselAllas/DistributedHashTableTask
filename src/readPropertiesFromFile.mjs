import * as fs from 'fs';
import Promise from 'bluebird';
import lineReader from 'line-reader';

const groupShortcutsByNodes = (properties) => {
  const shortcutNodeDict = {};
  properties.nodes.forEach((node) => {
    shortcutNodeDict[node] = [];
  });
  properties.shortcuts.forEach((shortcut) => {
    const [node, shortcutValue] = shortcut.split(':');
    shortcutNodeDict[node].push(shortcutValue);
  });

  return shortcutNodeDict;
};

const readPropertiesFromFile = async (path) => {
  if (!fs.existsSync(path)) {
    throw new Error(`Failed to read file: ${path}`);
  }
  const properties = {};
  let nextLine = '';
  const promisedEachLine = Promise.promisify(lineReader.eachLine);
  await promisedEachLine(path, (line) => {
    if (nextLine !== '') {
      properties[nextLine] = line.replace(/\s/g, '').split(',');
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
  return { ...properties, shortcuts: groupShortcutsByNodes(properties) };
};

export default readPropertiesFromFile;
