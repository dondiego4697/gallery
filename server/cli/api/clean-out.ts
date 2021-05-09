import execa from 'execa';
import path from 'path';

export async function handle() {
    const {ROOT_DIR} = cliRuntime();

    await execa('rm', ['-rf', path.resolve('./out')], {stdout: 'inherit', stderr: 'inherit', cwd: ROOT_DIR});
}
