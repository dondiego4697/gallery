import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {ClientError} from 'service/error';
import {toggleLike} from 'entity/picture/api/toggle-like';

export const like = wrap<Request, Response>(async (req, res) => {
    if (!req.user) {
        throw new ClientError('UNAUTHORIZED', {request: req, group: 'application'});
    }

    const {id} = req.params;

    const result = await toggleLike({pictureId: id, userId: req.user.id});

    res.json({result});
});
