import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

interface MinMax {
    min?: number;
    max?: number;
}

interface Body {
    limit: number;
    offset: number;
    filter?: {
        price?: MinMax;
        width?: MinMax;
        height?: MinMax;
        length?: MinMax;
        categoryCode?: string;
        selectionCode?: string;
        styleCode?: string;
        shapeFormatCode?: string;
    };
}

export const base = wrap<Request, Response>(async (req, res) => {
    const body = req.body as Body;

    res.json({body});
});
