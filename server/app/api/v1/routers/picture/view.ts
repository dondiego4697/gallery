import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const view = wrap<Request, Response>(async (_req, res) => {
    res.json({});
});
