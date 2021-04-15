import execa from 'execa';
import path from 'path';

export async function handle() {
    const {ROOT_DIR, argv} = cliRuntime();
    const {environment} = argv;

    await execa(
        'node_modules/.bin/ts-node',
        [path.resolve(ROOT_DIR, './node_modules/typeorm/cli.js'), '-c', environment, 'migration:run'],
        {
            stdout: 'inherit',
            stderr: 'inherit',
            cwd: ROOT_DIR
        }
    );
}
