// /**
//  * Generate an array based on a range of numbers
//  * @param {number} start - start number
//  * @param {number} end - end number
//  * @returns {number[]} - generated array
//  */
// // eslint-disable-next-line
// export default async function (globalConfig, projectConfig) {
//   // check docker-compose available ports
//   // TODO: unify this range of numbers (get from docker-compose file)
//   globalThis.dockerAvailablePorts = generateNumericArray(3000, 3020);
// }

// eslint-disable-next-line import/no-extraneous-dependencies
import { afterAll, beforeAll } from 'vitest';

// eslint-disable-next-line jsdoc/require-returns
/**
 *
 * @param start
 * @param end
 */
function generateNumericArray(start, end) {
  const result = [];
  for (let index = start; index <= end; index++) {
    result.push(index);
  }
  return result;
}

beforeAll(() => {
  // @ts-expect-error type
  globalThis.dockerAvailablePorts = generateNumericArray(3000, 3020);
});

afterAll(() => {
  // @ts-expect-error type
  delete globalThis.dockerAvailablePorts;
});
