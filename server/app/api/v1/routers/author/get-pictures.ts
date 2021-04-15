import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {object, defaulted, number, optional} from 'superstruct';
import {validateStruct} from 'app/lib/validate-struct';

export const queryStruct = object({
    limit: defaulted(optional(number()), 20),
    offset: number()
});

export const getPictures = wrap<Request, Response>(async (req, res) => {
    const {limit, offset} = validateStruct(queryStruct, req.query);

    // order by created_at
    res.json({limit, offset});
});
