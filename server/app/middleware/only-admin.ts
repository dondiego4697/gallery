import {wrap} from 'async-middleware';
import {Request, Response} from 'express';

import {ClientError} from 'service/error';

export const onlyAdmin = wrap<Request, Response>(async (req, _, next) => {
    const user = await req.context.getUser();

    if (!user?.isAdmin) {
        throw new ClientError('ACCESS_FORBIDDEN', {
            request: req
        });
    }

    next();
});
