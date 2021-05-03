import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

interface Body {
    query: string;
}

export const fullText = wrap<Request, Response>(async (req, res) => {
    const body = req.body as Body;

    res.json({body});
});
