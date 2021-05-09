/* eslint-disable @typescript-eslint/no-non-null-assertion */
import assert from 'assert';

interface DB {
    hosts: string[];
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface Config {
    'logger.colorize': boolean;
    'logger.level': string;
    'logger.silent'?: boolean;
    'logger.db.level': boolean | 'all' | 'error'[];
    'csrf.enable': boolean;
    'csrf.token.ttl': number;
    'cors.allowedOrigins': string[] | null;
    'header.requestId': string;
    'app.cache.enable': boolean;
    'app.host': string;
    's3.host': string;
    's3.bucketName': string;
    's3.key': string;
    's3.secret': string;
    'localtunnel.enable': boolean;
    'private.key': string;
    'cookie.key.userToken': string;
    'cookie.key.fingerprint': string;
    db: DB;
}

const production: Config = {
    'logger.colorize': false,
    'localtunnel.enable': false,
    'logger.db.level': ['error'],
    'logger.level': 'info',
    'cors.allowedOrigins': [],
    'header.requestId': 'x-request-id',
    'csrf.enable': true,
    'csrf.token.ttl': 60 * 60 * 1000, // 1h
    'app.cache.enable': true,
    's3.host': 'storage.yandexcloud.net',
    's3.bucketName': 'gallerian',
    's3.key': process.env.S3_KEY!,
    's3.secret': process.env.S3_SECRET!,
    'app.host': 'https://some_host.ru',
    'private.key': process.env.PRIVATE_KEY!,
    'cookie.key.userToken': 'user_token',
    'cookie.key.fingerprint': 'client_fingerprint',
    db: {
        hosts: ['localhost'],
        port: 6432,
        username: 'postgres',
        password: 'password',
        database: 'gallery'
    }
};

const testing: Config = {
    ...production,
    db: {
        ...production.db
    }
};

const development: Config = {
    ...testing,
    'localtunnel.enable': true,
    'logger.colorize': true,
    'logger.level': 'silly',
    'logger.silent': process.env.DISABLE_LOGGING === '1',
    'logger.db.level': 'all',
    'cors.allowedOrigins': null,
    'csrf.enable': false,
    'app.host': 'https://gallery.loca.lt',
    'app.cache.enable': false,
    db: {
        hosts: ['localhost', 'localhost'],
        port: 6432,
        username: 'postgres',
        password: 'password',
        database: 'gallery'
    }
};

const test: Config = {
    ...development,
    'logger.db.level': ['error'],
    'localtunnel.enable': false,
    'csrf.enable': true,
    'app.cache.enable': false,
    db: {
        ...development.db,
        database: 'gallery_test'
    }
};

const configs = new Map<string, Readonly<Config>>([
    ['production', production],
    ['testing', testing],
    ['development', development],
    ['test', test]
]);

const env = process.env.ENVIRONMENT || 'development';
const configForEnv = configs.get(env);

export const config = configForEnv!;

assert(config, `there is no configuration for environment "${env}"`);
assert(config['private.key'], 'there is no private key');
assert(config['s3.key'], 'there is no s3 key');
assert(config['s3.secret'], 'there is no s3 secret');
