import execa from 'execa';
import path from 'path';

import {handle as dbMigrate} from 'cli/api/db/migrate';

export async function handle(environment?: string) {
    const {ROOT_DIR, argv} = cliRuntime();
    const {environment: argvEnvironment} = argv;

    await execa('node', [path.resolve(ROOT_DIR, './out/server/tests/restore-db')], {
        stdout: 'inherit',
        stderr: 'inherit',
        cwd: ROOT_DIR,
        env: {
            ENVIRONMENT: environment || argvEnvironment
        }
    });

    await dbMigrate(environment || argvEnvironment);
}
