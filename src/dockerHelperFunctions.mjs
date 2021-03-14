import { exec } from 'child_process';

export const createDockerContainer = (node) =>
  exec(
    `docker run --network dht --ip 172.13.37.${node} --name dht-${node} -dit dht`,
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
