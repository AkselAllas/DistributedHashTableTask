import { exec } from 'child_process';

export const createDockerContainer = (node, shortcuts, keySpace, successors) =>
  exec(
    `docker run --network dht --ip 172.13.37.${node} --name dht-${node} -dit dht /usr/local/bin/node /app/src/node.js ${JSON.stringify(
      node
    )} ${JSON.stringify(shortcuts)} ${JSON.stringify(
      keySpace
    )} ${JSON.stringify(successors)}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`created node: ${node}`);
    }
  );
export const stopAndRemoveAllDHTDockerContainers = () => {
  exec(
    'docker container stop $(docker container ls -a --filter name=dht-) ; docker container rm $(docker container ls -a --filter name=dht-)',
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`output: ${stdout}`);
    }
  );
};
