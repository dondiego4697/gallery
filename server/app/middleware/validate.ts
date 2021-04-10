import {RequestHandler} from 'express';
import {Struct} from 'superstruct';
import {ParsedQs} from 'qs';
import * as Boom from '@hapi/boom';

export function bodyValidate(struct: Struct): RequestHandler {
    return (req, _, next) => {
        const body = validateStruct(struct, req.body);

        req.body = body;
        next();
    };
}

export function queryValidate(struct: Struct): RequestHandler {
    return (req, _res, next) => {
        const query = validateStruct(struct, req.query) as ParsedQs;

        req.query = query;
        next();
    };
}

function validateStruct(struct: Struct, data: unknown) {
    const [error, value] = struct.validate(data);

    if (typeof error !== 'undefined') {
        throw Boom.badRequest(error.message);
    }

    return value;
}