import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {random} from 'lodash';

import {config} from 'app/config';

export const networkMock = wrap<Request, Response>(async (_req, _res, next) => {
    if (config['mock.network']) {
        await new Promise((resolve) => setTimeout(resolve, random(2000, 4000)));
    }

    next();
});
