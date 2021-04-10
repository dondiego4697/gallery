import * as path from 'path';
import * as express from 'express';

export const router = express
    .Router()
    .use('/public/image/', express.static(path.resolve('resources/image')))
    .use('/public/fonts/', express.static(path.resolve('resources/fonts')))
    .use('/public/bundles/', express.static(path.resolve('out/client/bundles')));
