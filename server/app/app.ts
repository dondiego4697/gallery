import dotenv from 'dotenv';

dotenv.config();

import Boom from '@hapi/boom';
import localtunnel from 'localtunnel';
import assert from 'assert';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {renderHTML} from 'app/middleware/render-html';
import {router as staticRouter} from 'app/middleware/static';
import {ping} from 'app/middleware/ping';
import {helmet} from 'app/middleware/helmet';
import {requestId} from 'app/middleware/request-id';
import {logger as loggerMiddleware} from 'app/middleware/logger';
import {router as v1} from 'app/api/v1';
import {ClientError} from 'service/error';
import {config} from 'app/config';

const bodyParserJson = bodyParser.json({
    limit: '5mb',
    strict: false
});

export const app = express()
    .set('views', path.resolve('resources/views'))
    .set('view engine', 'pug')
    .enable('trust proxy')
    .disable('x-powered-by')
    .use(loggerMiddleware)
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
    .use(requestId)
    .use(helmet)
    .use(cookieParser())
    .use(bodyParserJson)
    .get('/ping', ping)
    .use(staticRouter)
    .use('/api/v1', v1)
    .get('/*', renderHTML)
    .use((_req, _res, next) => next(Boom.notFound('endpoint not found')))
    // eslint-disable-next-line
    .use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
        if (error.isBoom) {
            sendError(req, res, error);
        } else if (error instanceof ClientError) {
            sendError(req, res, Boom.badRequest(error.clientErrorCode));
        } else {
            sendError(req, res, Boom.boomify(error));
        }
    });

function sendError(req: express.Request, res: express.Response, error: Boom.Boom): void {
    req.logger.error(`error: ${error.message}`);
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
