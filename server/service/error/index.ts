import {Request} from 'express';
import {logger} from 'service/logger';

interface Params {
    message?: string;
    group?: 'application' | 'database';
    request?: Request;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: Record<string, any>;
}

type ClientErrorCode = 'ENTITY_NOT_FOUND';

export class LoggableError extends Error {
    constructor(params: Params) {
        const {message = '', group = 'unknown', meta = {}, request} = params;

        super(message);

        const log = {
            ...meta,
            group
        };

        if (request) {
            request.logger.error(message, log);
        } else {
            logger.error(message, log);
        }
    }
}

export class ClientError extends LoggableError {
    public clientErrorCode: ClientErrorCode;

    constructor(clientErrorCode: ClientErrorCode, params: Params = {}) {
        super(params);

        this.clientErrorCode = clientErrorCode;
    }
}
