import * as express from 'express';
import {requestContext} from 'app/middleware/request-context';
import {router as userRouter} from './routers/user';
import {router as authorRouter} from './routers/author';
import {router as productRouter} from './routers/product';

export const router = express
    .Router()
    .use(requestContext)
    .use('/user', userRouter)
    .use('/author', authorRouter)
    .use('/product', productRouter);
