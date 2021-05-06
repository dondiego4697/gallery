import execa from 'execa';
import path from 'path';

export async function handle() {
    const {ROOT_DIR, argv} = cliRuntime();
    const {watch, mode} = argv;

    await execa(
        'node_modules/.bin/webpack',
        [
            '--config',
            path.resolve(ROOT_DIR, './client/webpack.config.ts'),
            ...(watch ? ['--watch'] : []),
            ...(mode ? ['--mode', mode] : [])
        ],
        {stdout: 'inherit', stderr: 'inherit', cwd: ROOT_DIR}
    );
}
