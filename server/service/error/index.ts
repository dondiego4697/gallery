import {Request} from 'express';
import {logger} from 'service/logger';

interface Params {
    message?: string;
    group?: 'application' | 'database' | 'jwt';
    request?: Request;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: Record<string, any>;
}

type ClientErrorCode = 'ENTITY_NOT_FOUND' | 'UNAUTHORIZED' | 'BAD_USER_TOKEN';

export class LoggableError extends Error {
    constructor(params: Params, clientErrorCode: ClientErrorCode) {
        const {message, group, meta = {}, request} = params;

        super(message || clientErrorCode);

        const log = {
            ...meta,
            group: group || 'unknown'
        };

        if (request) {
            request.context.logger.error(message || clientErrorCode, log);
        } else {
            logger.error(message || clientErrorCode, log);
        }
    }
}

export class ClientError extends LoggableError {
    public clientErrorCode: ClientErrorCode;

    constructor(clientErrorCode: ClientErrorCode, params: Params = {}) {
        super(params, clientErrorCode);

        this.clientErrorCode = clientErrorCode;
    }
}
