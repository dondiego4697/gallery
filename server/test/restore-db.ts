import execa from 'execa';
import {dbManager} from 'app/lib/db-manager';

async function restoreSchema() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const connection = await dbManager.getConnection();

    await connection.query(`
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;

        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
}

async function migrateSchema(environment: string) {
    await execa('node_modules/.bin/ts-node', ['./node_modules/typeorm/cli.js', '-c', environment, 'migration:run'], {
        stdout: 'inherit',
        stderr: 'inherit'
    });
}

// Для jest
export default async function () {
    await restoreDb('test');
}

export async function restoreDb(environment = 'development') {
    if (!['development', 'test'].includes(environment)) {
        throw new Error(`environment "${environment}" does not support`);
    }

    await restoreSchema();
    await migrateSchema(environment);
}
