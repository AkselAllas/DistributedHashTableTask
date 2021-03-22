#!/usr/bin/env node
/* eslint-disable import/no-mutable-exports */
import repl from 'repl';
import readPropertiesFromFile from './readPropertiesFromFile.mjs';
import {
  createDockerContainer,
  stopAndRemoveAllDHTDockerContainers,
} from './dockerHelperFunctions.mjs';

import { helpReadme } from './cliHelperFunctions.mjs';
import {
  lookup,
  list,
  getNode,
  sendNodePostRequest,
  travelCircleAndSetPredecessors,
} from './nodeHelperFunctions.mjs';

// eslint-disable-next-line no-var
export var firstNode = [];
// eslint-disable-next-line no-var
export var keySpace = [];

const createCLI = () => {
  const local = repl.start('node::local> ');
  local.context.setNode = sendNodePostRequest;
  local.context.stopDocker = stopAndRemoveAllDHTDockerContainers;
  local.context.help = helpReadme;
  local.context.getNode = getNode;
  local.context.list = list;
  local.context.lookup = lookup;
  local.context.travelCircleAndSetPredecessors = travelCircleAndSetPredecessors;
  setTimeout(() => {
    console.log("Type 'help()' for list of available commands");
  }, 1500);
};

const main = async () => {
  const properties = await readPropertiesFromFile(process.argv[2]);
  const validNodes = properties.nodes.filter(
    (node) => node <= properties.keySpace[1] && node >= properties.keySpace[0]
  );
  const sortedNodes = validNodes.sort((a, b) => a - b);
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

  keySpace = [...properties.keySpace];
  firstNode = sortedNodes[0];
  createCLI();
};

try {
  main();
} catch (e) {
  console.error('\x1b[31m', e);
  process.exit(1);
}
