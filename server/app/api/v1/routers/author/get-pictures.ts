import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const getPictures = wrap<Request, Response>(async (_req, res) => {
    res.json({});
});
