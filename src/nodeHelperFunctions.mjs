/* eslint-disable no-await-in-loop */
import requestify from 'requestify';
import { firstNode } from './main.mjs';
import { generateRange } from './helperFunctions.mjs';

// eslint-disable-next-line import/prefer-default-export
export const sendNodePostRequest = (stringBody) => {
  const inputString = stringBody.replace(/"/g, '');
  const splitters = inputString.split(' ');
  const node = splitters[0];
  requestify.post(`http://172.13.37.${node}:3000/`, stringBody);
};

export const postNodePredecessor = (node, nodeObject) => {
  requestify.post(`http://172.13.37.${node}:3000/predecessor`, nodeObject);
};

export const getNode = (node) => {
  requestify.get(`http://172.13.37.${node}:3000/`).then((response) => {
    console.log(response.getBody());
  });
};

const parseNodeValues = async (inputString) => {
  inputString = inputString.replace(/"/g, '');
  const splitters = inputString.split(' ');
  const node = splitters[0];
  const shortcuts = JSON.parse(splitters[1]);
  const keySpaceString = JSON.parse(splitters[2]);
  const p0 = splitters[3].replace(/{|}/g, '').split(',');
  const p1 = p0[0].split(':');
  const p2 = p0[1].split(':');
  const predecessor = splitters[5];
  const validKeys = generateRange(
    parseInt(predecessor, 10),
    parseInt(node, 10)
  );
  return {
    node: node,
    shortcuts: shortcuts,
    keySpace: keySpaceString,
    successor: p1[1],
    nextSuccessor: p2[1],
    validKeys: validKeys,
    predecessor: predecessor,
  };
};

export const getNodeObject = async (node) =>
  requestify
    .get(`http://172.13.37.${node}:3000/`)
    .then(async (response) => parseNodeValues(response.getBody()));

const getSuccessor = async (node) =>
  requestify.get(`http://172.13.37.${node}:3000/`).then((response) => {
    const responseBody = response.getBody();
    console.log(responseBody);
    const splitBody = responseBody.split(' ');
    const { successor } = JSON.parse(splitBody[3]);
    return successor;
  });

export const list = async () => {
  let successorToCompare = await getSuccessor(firstNode);
  while (successorToCompare !== firstNode) {
    // eslint-disable-next-line no-await-in-loop
    successorToCompare = await getSuccessor(successorToCompare);
  }
};

export const travelCircleAndSetPredecessors = async (
  startingNode = firstNode
) => {
  const firstNodeObject = await getNodeObject(startingNode);
  postNodePredecessor(firstNodeObject.successor, firstNodeObject);
  let nodeObjectToCompare = await getNodeObject(firstNodeObject.successor);
  while (nodeObjectToCompare.node !== firstNodeObject.node) {
    postNodePredecessor(nodeObjectToCompare.successor, nodeObjectToCompare);
    nodeObjectToCompare = await getNodeObject(nodeObjectToCompare.successor);
  }
};

const getClosestNode = (nodeObject, targetNode) => {
  let difference = Number.MAX_SAFE_INTEGER;
  const { shortcuts } = nodeObject;
  if (shortcuts.length !== 0 && shortcuts !== undefined) {
    let closestNode = 0;
    const combinedArray = shortcuts.concat(parseInt(nodeObject.successor, 10));
    combinedArray.forEach((nodeValue) => {
      if (targetNode - nodeValue > 0 && targetNode - nodeValue < difference) {
        difference = targetNode - nodeValue;
        closestNode = nodeValue;
      }
    });
    return closestNode;
  }
  return nodeObject.successor;
};

const nodeContainsTargetNode = (nodeObject, targetNode) => {
  if (nodeObject.validKeys.includes(targetNode)) {
    return true;
  }
  return false;
};

export const lookup = async (nodeToLookFor, nodeToBeginWith = firstNode) => {
  let requestCount = 0;
  let nodeObjectOfInterest = await getNodeObject(nodeToBeginWith);
  travelCircleAndSetPredecessors(nodeToBeginWith);
  while (!nodeContainsTargetNode(nodeObjectOfInterest, nodeToLookFor)) {
    requestCount += 1;
    const closestNode = getClosestNode(nodeObjectOfInterest, nodeToLookFor);
    nodeObjectOfInterest = await getNodeObject(closestNode);
  }
  console.log(
    `Result: Data stored in node ${nodeObjectOfInterest.node} – ${requestCount} requests sent`
  );
};
