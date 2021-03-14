#!/usr/bin/env node
/* eslint-disable no-var */
import http from 'http';
import { getIPAddress, generateRange } from './helperFunctions.mjs';
import { sendNodePostRequest } from './nodeHelperFunctions.mjs';

//Initialize node status
var node = process.argv[2];
var shortcuts = JSON.parse(process.argv[3]);
var keySpace = JSON.parse(process.argv[4]);
var p0 = process.argv[5].replace(/{|}/g, '').split(',');
var p1 = p0[0].split(':');
var p2 = p0[1].split(':');
var successors = JSON.parse(`{"${p1[0]}":${p1[1]},"${p2[0]}":${p2[1]}}`);
var validKeys = generateRange(
  parseInt(node, 10),
  parseInt(successors.successor, 10)
);

const setNodeValues = (inputString) => {
  inputString = inputString.replace(/"/g, '');
  console.log('MONKATOS:', inputString);
  const splitters = inputString.split(' ');
  node = splitters[0];
  shortcuts = JSON.parse(splitters[1]);
  keySpace = JSON.parse(splitters[2]);
  console.log('SPLITTERS', splitters[3]);
  p0 = splitters[3].replace(/{|}/g, '').split(',');
  p1 = p0[0].split(':');
  p2 = p0[1].split(':');
  successors = JSON.parse(`{"${p1[0]}":${p1[1]},"${p2[0]}":${p2[1]}}`);
  validKeys = generateRange(
    parseInt(node, 10),
    parseInt(successors.successor, 10)
  );
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
      )} ${JSON.stringify(successors)} ${JSON.stringify(validKeys)}`
    );
  }
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (data) => {
      body += data;
    });
    req.on('end', () => {
      console.log(`Body: ${body}`);
      console.log(typeof body);
      setNodeValues(body);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('200');
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

setTimeout(() => {
  console.log('SENT SHIT');
  sendNodePostRequest('12 [34] [1,100] {successor:21,nextSuccessor:43}');
}, 5000);
