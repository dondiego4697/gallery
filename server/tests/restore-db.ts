import {dbManager} from 'app/lib/db-manager';

export default async function () {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const connection = await dbManager.getConnection();

    await connection.query(`
        DROP SCHEMA IF EXISTS public CASCADE;
        CREATE SCHEMA public;

        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
}
