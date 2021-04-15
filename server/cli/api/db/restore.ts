import {restoreDb} from 'tests/restore-db';

export async function handle() {
    const {argv} = cliRuntime();
    const {environment} = argv;

    await restoreDb(environment);
}
