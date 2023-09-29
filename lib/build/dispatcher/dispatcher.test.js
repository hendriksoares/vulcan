import mockFS from 'mock-fs';
import path from 'path';
import Dispatcher from './dispatcher.js';

describe('dispatcher', () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  // });

  // afterAll(() => {
  //   jest.restoreAllMocks();
  // });
  it('should create a Dispatcher instance with correct properties', async () => {
    const newDispatcher = new Dispatcher('js', 'delivery', 'main.js', false);
    expect(newDispatcher.preset).toBe('js');
    expect(newDispatcher.mode).toBe('delivery');
    expect(newDispatcher.entry).toBe('main.js');
    expect(newDispatcher.useNodePolyfills).toBe(false);
  });

  it('should run the build with invalid preset name and expect it fail', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error(`process.exit: 1`);
    });
    const newDispatcher = new Dispatcher(
      'invalidPressetName',
      'delivery',
      'main.js',
      true,
    );
    await expect(newDispatcher.run()).rejects.toThrow(`process.exit: 1`);
    mockExit.mockRestore();
  });

  // it('should run dispatcher and exit with code 1 if node_modules does not exist', async () => {
  //   mockFS({
  //     vulcan: {
  //       lib: {
  //         presets: {
  //           default: {
  //             react: { delivery: { 'main.js': "console.log('hello world')" } },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  //     throw new Error(`process.exit: 1`);
  //   });
  //   const newDispatcher = new Dispatcher('react', 'delivery', 'main.js', false);
  //   await expect(newDispatcher.run()).rejects.toThrow(`process.exit: 1`);
  //   mockExit.mockRestore();
  //   mockFS.restore();
  // });

  it('should run dispatcher and exit with code 1 if node_modules does not exist 2', async () => {
    mockFS({
      'main.js': mockFS.load(path.resolve('examples/simple-js-esm/main.js')),
      node_modules: {},
      'package.json': mockFS.load(path.resolve('package.json')),
      lib: {
        providers: {
          azion: {
            'worker.js': mockFS.load(
              path.resolve(process.cwd(), 'lib/providers/azion/worker.js'),
              { lazy: false },
            ),
          },
        },
        presets: {
          custom: {
            angular: {},
            hexo: {},
            vue: {},
            kombi: {},
            react: {
              deliver: {
                'config.js': mockFS.load(
                  path.resolve(
                    process.cwd(),
                    'lib/presets/custom/react/deliver/config.js',
                  ),
                  { lazy: false },
                ),
                'handler.js': mockFS.load(
                  path.resolve(
                    process.cwd(),
                    'lib/presets/custom/react/deliver/handler.js',
                  ),
                  { lazy: false },
                ),
                'prebuild.js': mockFS.load(
                  path.resolve(
                    process.cwd(),
                    'lib/presets/custom/react/deliver/prebuild.js',
                  ),
                  { lazy: false },
                ),
              },
            },
          },
          default: {
            html: {},
            javascript: {
              compute: {
                'config.js': mockFS.load(
                  path.resolve(
                    'lib/presets/default/javascript/compute/config.js',
                  ),
                  { lazy: false },
                ),
                'handler.js': mockFS.load(
                  path.resolve(
                    'lib/presets/default/javascript/compute/handler.js',
                  ),
                  { lazy: false },
                ),
                'prebuild.js': mockFS.load(
                  path.resolve(
                    'lib/presets/default/javascript/compute/prebuild.js',
                  ),
                  { lazy: false },
                ),
              },
            },
            typescript: {},
          },
        },
      },
    });
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error(`process.exit: 1`);
    });

    const newDispatcher = new Dispatcher(
      'javascript',
      'compute',
      'main.js',
      false,
    );

    jest.spyOn(newDispatcher, 'builder').mockImplementation(() => {
      'builder';
    });
    await newDispatcher.run();
    expect(newDispatcher.builder).toHaveBeenCalled();
    mockExit.mockRestore();
    mockFS.restore();
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
