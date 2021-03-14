#!/usr/bin/env node
import readPropertiesFromFile from './readPropertiesFromFile.mjs';
import {
  createDockerContainer,
  stopAndRemoveAllDHTDockerContainers,
} from './dockerHelperFunctions.mjs';

const main = async () => {
  const properties = await readPropertiesFromFile(process.argv[2]);
  console.log(properties);
  const sortedNodes = properties.nodes.sort((a, b) => a - b);
  sortedNodes.forEach((node, i) => {
    createDockerContainer(
      node,
      properties.shortcuts[node],
      properties.keySpace,
      { successor: sortedNodes[i + 1], nextSuccessor: sortedNodes[i + 2] }
    );
  });
  //setTimeout(() => {
  //  console.log('MONK');
  //  stopAndRemoveAllDHTDockerContainers();
  //}, 5000);
};

try {
  main();
} catch (e) {
  console.error('\x1b[31m', e);
  process.exit(1);
}
