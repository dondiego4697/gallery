import * as express from 'express';

import {router as authorRouter} from './routers/author';
import {router as mordaRouter} from './routers/morda';
import {router as productRouter} from './routers/product';
import {router as searchRouter} from './routers/search';
import {router as userRouter} from './routers/user';

export const router = express
    .Router()
    .use('/user', userRouter)
    .use('/morda', mordaRouter)
    .use('/author', authorRouter)
    .use('/search', searchRouter)
    .use('/product', productRouter);
