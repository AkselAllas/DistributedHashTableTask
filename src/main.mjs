#!/usr/bin/env node
import repl from 'repl';
import readPropertiesFromFile from './readPropertiesFromFile.mjs';
import {
  createDockerContainer,
  stopAndRemoveAllDHTDockerContainers,
} from './dockerHelperFunctions.mjs';

import { helpReadme } from './cliHelperFunctions.mjs';
import { sendNodePostRequest } from './nodeHelperFunctions.mjs';

const main = async () => {
  const properties = await readPropertiesFromFile(process.argv[2]);
  console.log(properties);
  const sortedNodes = properties.nodes.sort((a, b) => a - b);
  sortedNodes.forEach((node, i) => {
    const indexOne = (i + 1) % sortedNodes.length;
    const indexTwo = (i + 2) % sortedNodes.length;
    createDockerContainer(
      node,
      properties.shortcuts[node],
      properties.keySpace,
      {
        successor: sortedNodes[indexOne],
        nextSuccessor: sortedNodes[indexTwo],
      }
    );
  });
  const local = repl.start('node::local> ');
  local.context.setNode = sendNodePostRequest;
  local.context.stopDocker = stopAndRemoveAllDHTDockerContainers;
  local.context.help = helpReadme;
  setTimeout(() => {
    console.log("Type 'help()' for list of available commands");
  }, 1500);
};

try {
  main();
} catch (e) {
  console.error('\x1b[31m', e);
  process.exit(1);
}
