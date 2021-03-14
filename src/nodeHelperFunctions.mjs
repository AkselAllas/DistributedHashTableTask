import requestify from 'requestify';

// eslint-disable-next-line import/prefer-default-export
export const sendNodePostRequest = (stringBody) => {
  const inputString = stringBody.replace(/"/g, '');
  const splitters = inputString.split(' ');
  const node = splitters[0];
  requestify.post(`http://172.13.37.${node}:3000/`, stringBody);
};
