import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const getInfo = wrap<Request, Response>(async (_req, res) => {
    res.json({number: Math.random()});
});
