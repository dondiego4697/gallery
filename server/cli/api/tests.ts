import execa from 'execa';

import {handle as compileServer} from 'cli/api/server/compile';
import {handle as dbMigrate} from 'cli/api/db/migrate';
import {handle as dbRestore} from 'cli/api/db/restore';

export async function handle() {
    const {ROOT_DIR, argv} = cliRuntime();
    const {pattern} = argv;
    const environment = 'tests';

    const jestParams = ['--config=jest.config.json', '--forceExit'];

    if (pattern) {
        jestParams.push(pattern);
    }

    await compileServer();

    console.log('restore db running...');

    await dbRestore(environment);

    console.log('migration db running...');

    await dbMigrate(environment);

    console.log('tests running...');

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
