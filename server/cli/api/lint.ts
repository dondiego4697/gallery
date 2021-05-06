import execa from 'execa';
import path from 'path';

async function lintServer(rootDir: string, fix?: boolean) {
    const params = [path.resolve(rootDir, 'server'), '--ext', 'ts'];

    if (fix) {
        params.push('--fix');
    }

    await execa('node_modules/.bin/eslint', params, {stdout: 'inherit', stderr: 'inherit', cwd: rootDir});
}

async function lintClient(rootDir: string, fix?: boolean) {
    const params = [path.resolve(rootDir, 'client'), '--ext', 'ts,tsx'];

    if (fix) {
        params.push('--fix');
    }

    await execa('node_modules/.bin/eslint', params, {stdout: 'inherit', stderr: 'inherit', cwd: rootDir});
}

export async function handle() {
    const {ROOT_DIR, argv} = cliRuntime();
    const {fix} = argv;

    await Promise.all([lintServer(ROOT_DIR, fix), lintClient(ROOT_DIR, fix)]);
}
