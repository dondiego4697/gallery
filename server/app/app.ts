import dotenv from 'dotenv';

dotenv.config();

import Boom from '@hapi/boom';
import assert from 'assert';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import localtunnel from 'localtunnel';
import path from 'path';

import {router as imageUploader} from 'app/api/image-uploader';
import {router as v1} from 'app/api/v1';
import {config} from 'app/config';
import {helmet} from 'app/middleware/helmet';
import {ping} from 'app/middleware/ping';
import {renderHTML} from 'app/middleware/render-html';
import {requestContext} from 'app/middleware/request-context';
import {router as staticRouter} from 'app/middleware/static';
import {ClientError} from 'service/error';

const bodyParserJson = bodyParser.json({
    limit: '5mb',
    strict: false
});

export const app = express()
    .set('views', path.resolve('resources/views'))
    .set('view engine', 'pug')
    .enable('trust proxy')
    .disable('x-powered-by')
    .use(
        cors({
            methods: ['GET, POST, PUT, PATCH, DELETE, OPTIONS'],
            allowedHeaders: config['header.requestId'],
            credentials: true,
            origin: (origin, callback) => {
                if (config['cors.allowedOrigins'] === null) {
                    callback(null, true);
                } else if (typeof origin === 'undefined' || !config['cors.allowedOrigins'].includes(origin)) {
                    callback(Boom.forbidden('forbid by CORS'));
                }
            }
        })
    )
    .use(helmet)
    .use(cookieParser())
    .use(bodyParserJson)
    .get('/ping', ping)
    .use(staticRouter)
    .use(requestContext)
    .use('/api/v1', v1)
    .use('/api/image-uploader', imageUploader)
    .get('/*', renderHTML)
    .use((_req, _res, next) => next(Boom.notFound('endpoint not found')))
    // eslint-disable-next-line
    .use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
        if (error.isBoom) {
            sendError(req, res, error);
        } else if (error instanceof ClientError) {
            const code = error.clientErrorCode;

            if (code === 'UNAUTHORIZED') {
                sendError(req, res, Boom.unauthorized(code), false);
            } else if (code === 'ENTITY_NOT_FOUND') {
                sendError(req, res, Boom.notFound(code), false);
            } else if (code === 'ACCESS_FORBIDDEN') {
                sendError(req, res, Boom.forbidden(code));
            } else {
                sendError(req, res, Boom.badRequest(code));
            }
        } else {
            sendError(req, res, Boom.boomify(error));
        }
    });

function sendError(req: express.Request, res: express.Response, error: Boom.Boom, writeLog = true): void {
    if (writeLog) {
        req.context.logger.error(`error: ${error.message}`);
    }

    res.status(error.output.statusCode).json(error.output.payload);
}

if (!module.parent) {
    const port = Number(process.env.NODEJS_PORT) || 8080;

    assert(port, 'no port provided for the application to listen to');

    if (config['localtunnel.enable']) {
        localtunnel({port, subdomain: 'gallery'}).then((tunnel) => {
            console.log(`tunnel created ${tunnel.url}`);
        });
    }

    app.listen(port, () => console.log(`application started on port ${port}`));
}
