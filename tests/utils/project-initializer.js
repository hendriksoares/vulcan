import { feedback } from '#utils';
import {
  waitForVulcanServer,
  execCommandInContainer,
} from './docker-env-actions.js';

// const { execSync } = require('child_process');
/**
 * Run actions to build and run project in docker container
 * @param {string} examplePath - project path in container
 * @param {string} preset - vulcan preset to build
 * @param {string} mode - vulcan preset mode to build
 * @param {number} serverPort - port to use in vulcan server
 * @param {boolean} installPkgs - dependencies need to be installed?
 */
async function projectInitializer(
  examplePath,
  preset,
  mode,
  serverPort,
  installPkgs = true,
) {
  const example = examplePath.replace('/examples/', '');
  const vulcanCmd =
    'npx --yes --registry=http://verdaccio:4873 edge-functions@latest';

  if (installPkgs) {
    feedback.info(`[${example}] Installing project dependencies ...`);
    await execCommandInContainer('yarn', examplePath);
  }

  feedback.info(`[${example}] Building the project ...`);
  // console.log(`${vulcanCmd} build --preset ${preset} --mode ${mode}`);
  // execSync('sleep 1'); // block process for 1 second.
  await execCommandInContainer(
    `${vulcanCmd} build --preset ${preset} --mode ${mode}`,
    examplePath,
  );
  // execSync('sleep 1'); // block process for 1 second.
  feedback.info(`[${example}] Starting vulcan local server ...`);
  await execCommandInContainer(
    `${vulcanCmd} dev -p ${serverPort}`,
    examplePath,
    true,
  );
  // execSync('sleep 1');
  await waitForVulcanServer(true);
  // execSync('sleep 1');
  feedback.info(`[${example}] vulcan local server started!`);
}

export default projectInitializer;
