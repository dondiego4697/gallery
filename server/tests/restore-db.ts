import execa from 'execa';
import {dbManager} from 'app/lib/db-manager';

export async function restoreDb(environment = 'development') {
    if (!['development', 'tests'].includes(environment)) {
        throw new Error(`environment "${environment}" does not support`);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const connection = await dbManager.getConnection();

    await connection.query(`
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;

        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await execa('node_modules/.bin/ts-node', ['./node_modules/typeorm/cli.js', '-c', environment, 'migration:run'], {
        stdout: 'inherit',
        stderr: 'inherit'
    });
}
