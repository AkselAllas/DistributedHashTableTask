#!/usr/bin/env node
/* eslint-disable prefer-destructuring */
/* eslint-disable no-var */
import http from 'http';
import { getIPAddress, generateRange } from './helperFunctions.mjs';

//Initialize node status
var node = process.argv[2];
var shortcuts = JSON.parse(process.argv[3]);
var keySpace = JSON.parse(process.argv[4]);
var p0 = process.argv[5].replace(/{|}/g, '').split(',');
var p1 = p0[0].split(':');
var p2 = p0[1].split(':');
var successors = JSON.parse(`{"${p1[0]}":${p1[1]},"${p2[0]}":${p2[1]}}`);
var predecessor = '';
var validKeys = generateRange(parseInt(predecessor, 10), parseInt(node, 10));

const setNodeValues = (inputString) => {
  inputString = inputString.replace(/"/g, '');
  const splitters = inputString.split(' ');
  node = splitters[0];
  shortcuts = JSON.parse(splitters[1]);
  keySpace = JSON.parse(splitters[2]);
  p0 = splitters[3].replace(/{|}/g, '').split(',');
  p1 = p0[0].split(':');
  p2 = p0[1].split(':');
  successors = JSON.parse(`{"${p1[0]}":${p1[1]},"${p2[0]}":${p2[1]}}`);
  predecessor = splitters[5];
  validKeys = generateRange(parseInt(predecessor, 10), parseInt(node, 10));
};

const getValidKeys = (nodeObject) => {
  const lowerBound = parseInt(nodeObject.node, 10) + 1;
  const upperBound = parseInt(nodeObject.successor, 10) + 1;
  if (lowerBound > upperBound) {
    const firstArray = generateRange(lowerBound, keySpace[1] + 1);
    const secondArray = generateRange(keySpace[0], upperBound);
    const fullArray = firstArray.concat(secondArray);
    return fullArray;
  }
  return generateRange(lowerBound, upperBound);
};

const setPredecessorFromObject = (nodeObject) => {
  predecessor = nodeObject.node;
  validKeys = getValidKeys(nodeObject);
};

const hostname = getIPAddress();
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if (req.url === '/' && req.method === 'GET') {
    res.end(
      `${JSON.stringify(node)} ${JSON.stringify(shortcuts)} ${JSON.stringify(
        keySpace
      )} ${JSON.stringify(successors)} ${JSON.stringify(
        validKeys
      )} ${JSON.stringify(predecessor)} `
    );
  } else if (req.url === '/' && req.method === 'POST') {
    let body = '';
    req.on('data', (data) => {
      body += data;
    });
    req.on('end', () => {
      setNodeValues(body);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('200');
    });
  } else if (req.url === '/predecessor' && req.method === 'POST') {
    let body = '';
    req.on('data', (data) => {
      body += data;
    });
    req.on('end', () => {
      setPredecessorFromObject(JSON.parse(body));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('200');
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
