import execa from 'execa';

import {handle as compileServer} from 'cli/api/server/compile';

export async function handle() {
    const {ROOT_DIR, argv} = cliRuntime();
    const {pattern} = argv;
    const environment = 'test';

    const jestParams = ['--config=jest.config.json', '--forceExit'];

    if (pattern) {
        jestParams.push(pattern);
    }

    await compileServer();

    await execa('node_modules/.bin/jest', jestParams, {
        stdout: 'inherit',
        stderr: 'inherit',
        cwd: ROOT_DIR,
        env: {
            ENVIRONMENT: environment,
            DISABLE_LOGGING: '1'
        }
    });
}
