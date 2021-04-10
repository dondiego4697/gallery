import * as express from 'express';
import {router as authorRouter} from './routers/author';
import {router as pictureRouter} from './routers/picture';
import {router as mordaRouter} from './routers/morda';
import {router as searchRouter} from './routers/search';

export const router = express
    .Router()
    .use('/morda', mordaRouter)
    .use('/picture', pictureRouter)
    .use('/author', authorRouter)
    .use('/search', searchRouter);
// .use('/user');
