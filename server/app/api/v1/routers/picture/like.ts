import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {ClientError} from 'service/error';
import {toggleLike} from 'entity/picture/api/toggle-like';
import {checkPictureExistance} from 'entity/picture/api/get-picture-by-public-id';

export const like = wrap<Request, Response>(async (req, res) => {
    const user = await req.context.getUser();

    if (!user) {
        throw new ClientError('UNAUTHORIZED', {request: req, group: 'application'});
    }

    const {id: publicId} = req.params;

    const pictureId = await checkPictureExistance(publicId);

    if (!pictureId) {
        throw new ClientError('ENTITY_NOT_FOUND', {request: req, group: 'application'});
    }

    const result = await toggleLike({pictureId, userId: user.id});

    res.json({result});
});
