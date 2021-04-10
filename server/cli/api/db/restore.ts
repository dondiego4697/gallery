import execa from 'execa';
import path from 'path';

export async function handle(environment?: string) {
    const {ROOT_DIR, argv} = cliRuntime();
    const {environment: argvEnvironment} = argv;

    await execa('node', [path.resolve(ROOT_DIR, './out/server/tests/test-restore-db')], {
        stdout: 'inherit',
        stderr: 'inherit',
        cwd: ROOT_DIR,
        env: {
            ENVIRONMENT: environment || argvEnvironment
        }
    });
}
