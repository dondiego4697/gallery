import {restoreDb} from 'test/restore-db';

export async function handle() {
    const {argv} = cliRuntime();
    const {environment} = argv;

    await restoreDb(environment);
}
