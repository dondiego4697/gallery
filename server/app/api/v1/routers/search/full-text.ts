import {wrap} from 'async-middleware';
import {Request, Response} from 'express';

interface Body {
    query: string;
}

export const fullText = wrap<Request, Response>(async (req, res) => {
    const body = req.body as Body;

    res.json({body});
});
