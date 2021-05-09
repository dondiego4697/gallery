import {Request} from 'express';

import {logger} from 'service/logger';

interface BaseParams {
    group?: 'application' | 'database' | 'jwt';
    request?: Request;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: Record<string, any>;
}

interface ClientErrorParams extends BaseParams {
    message?: string;
}

interface LoggableErrorParams extends BaseParams {
    message: string;
    statusCode?: number;
}

type ClientErrorCode = 'ENTITY_NOT_FOUND' | 'UNAUTHORIZED' | 'BAD_USER_TOKEN' | 'ACCESS_FORBIDDEN';

class LoggableError extends Error {
    constructor(params: LoggableErrorParams) {
        const {message, group, meta = {}, request} = params;

        super(message);

        const log = {
            ...meta,
            group: group || 'unknown'
        };

        if (request) {
            request.context.logger.error(message, log);
        } else {
            logger.error(message, log);
        }
    }
}

export class ClientError extends LoggableError {
    public clientErrorCode: ClientErrorCode;

    constructor(clientErrorCode: ClientErrorCode, params: ClientErrorParams = {}) {
        super({
            ...params,
            message: params.message || clientErrorCode
        });

        this.clientErrorCode = clientErrorCode;
    }
}
