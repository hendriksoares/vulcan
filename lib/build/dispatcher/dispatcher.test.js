import { expect } from '@jest/globals';
import Dispatcher from './dispatcher.js';

describe('dispatcher', () => {
  it('should create a Dispatcher instance with correct properties', async () => {
    const config = {
      entry: 'main.js',
      builder: 'esbuild',
      preset: {
        name: 'javascript',
        mode: 'compute',
      },
      useNodePolyfills: false,
      useOwnWorker: false,
      memoryFS: undefined,
      custom: {},
    };

    const expectedDispatcher = {
      entry: 'main.js',
      builder: 'esbuild',
      preset: { name: 'javascript', mode: 'compute' },
      useNodePolyfills: false,
      useOwnWorker: false,
      memoryFS: undefined,
      custom: {},
      buildId: '123456',
    };

    /**
     *
     */
    function mockGenerateTimestamp() {
      return '123456';
    }
    const newDispatcher = new Dispatcher(config, mockGenerateTimestamp());
    console.log(newDispatcher);
    expect(newDispatcher).toBeInstanceOf(Dispatcher);
    expect(newDispatcher).toEqual(expectedDispatcher);
  });

  // it('should return modules', async () => {
  //   const configFilePath = path.resolve(
  //     join(process.cwd(), 'lib/presets/default/javascript/compute/config.js'),
  //   );
  //   const prebuildFilePath = path.resolve(
  //     join(process.cwd(), 'lib/presets/default/javascript/compute/prebuild.js'),
  //   );

  //   const [config, prebuild] = await returnModules(
  //     configFilePath,
  //     prebuildFilePath,
  //   );
  //   console.log(config, prebuild);
  //   expect(config).toEqual({
  //     builder: 'esbuild',
  //     useNodePolyfills: false,
  //     custom: {},
  //   });

  //   expect(prebuild).toBeInstanceOf(Function);
  //   expect(prebuild.constructor.name).toBe('AsyncFunction');
  // });

  // it('should load build context', async () => {
  //   const buildContext = await loadBuildContext(
  //     'javascript',
  //     'main.js',
  //     'compute',
  //   );
  //   console.log(buildContext);
  //   expect(true).toBe(true);
  // });
});
