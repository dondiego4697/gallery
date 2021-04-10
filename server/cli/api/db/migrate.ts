import execa from 'execa';
import path from 'path';

export async function handle(environment?: string) {
    const {ROOT_DIR, argv} = cliRuntime();
    const {environment: argvEnvironment} = argv;

    await execa(
        'node_modules/.bin/ts-node',
        [
            path.resolve(ROOT_DIR, './node_modules/typeorm/cli.js'),
            '-c',
            environment || argvEnvironment,
            'migration:run'
        ],
        {
            stdout: 'inherit',
            stderr: 'inherit',
            cwd: ROOT_DIR
        }
    );
}
