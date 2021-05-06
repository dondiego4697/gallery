import {handle as clientDev} from 'cli/api/client/compile';
import {handle as serverDev} from 'cli/api/server/dev';

export async function handle() {
    const {argv} = cliRuntime();

    argv['watch'] = true;

    await Promise.all([serverDev(), clientDev()]);
}
