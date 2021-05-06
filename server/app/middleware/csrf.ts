import * as Boom from '@hapi/boom';
import {wrap} from 'async-middleware';
import {Request, Response} from 'express';

import {config} from 'app/config';
import {CSRF} from 'app/lib/csrf';

export const csrf = wrap<Request, Response>(async (req, res, next) => {
    if (!config['csrf.enable']) {
        return next();
    }

    if (CSRF.isTokenValid(req)) {
        res.cookie('csrf_token', CSRF.generateToken(), {maxAge: config['csrf.token.ttl']});

        return next();
    }

    res.clearCookie('csrf_token');
    throw Boom.forbidden('invalid csrf');
});
