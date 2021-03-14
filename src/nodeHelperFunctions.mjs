import requestify from 'requestify';
import { firstNode } from './main.mjs';

// eslint-disable-next-line import/prefer-default-export
export const sendNodePostRequest = (stringBody) => {
  const inputString = stringBody.replace(/"/g, '');
  const splitters = inputString.split(' ');
  const node = splitters[0];
  requestify.post(`http://172.13.37.${node}:3000/`, stringBody);
};

export const getNode = (node) => {
  requestify.get(`http://172.13.37.${node}:3000/`).then((response) => {
    console.log(response.getBody());
  });
};

const getSuccessor = async (node) =>
  requestify.get(`http://172.13.37.${node}:3000/`).then((response) => {
    const responseBody = response.getBody();
    console.log(responseBody);
    const splitBody = responseBody.split(' ');
    const { successor } = JSON.parse(splitBody[6]);
    return successor;
  });

export const list = async () => {
  let successorToCompare = await getSuccessor(firstNode);
  while (successorToCompare !== firstNode) {
    // eslint-disable-next-line no-await-in-loop
    successorToCompare = await getSuccessor(successorToCompare);
  }
};
