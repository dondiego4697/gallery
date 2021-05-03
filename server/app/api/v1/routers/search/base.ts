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
        productCategoryCode?: string;
        price?: MinMax;
        width?: MinMax;
        height?: MinMax;
        length?: MinMax;
        selectionCode?: string;
        style?: string;
        shapeFormat?: string;
    };
}

export const base = wrap<Request, Response>(async (req, res) => {
    const body = req.body as Body;

    res.json({body});
});
