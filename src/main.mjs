#!/usr/bin/env node
import readPropertiesFromFile from './readPropertiesFromFile.mjs';

const main = async () => {
  const properties = await readPropertiesFromFile(process.argv[2]);
  console.log(properties);
};

try {
  main();
} catch (e) {
  console.error('\x1b[31m', e);
  process.exit(1);
}
