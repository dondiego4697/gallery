import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {addView} from 'entity/picture/api/add-view';
import {checkPictureExistance} from 'entity/picture/api/get-picture-by-public-id';
import {ClientError} from 'service/error';

export const view = wrap<Request, Response>(async (req, res) => {
    const fingerprint = req.context.browserFingerprint;

    if (!fingerprint) {
        req.context.logger.warn('browser fingerprint does not exists');

        return res.json({});
    }

    const {id: publicId} = req.params;

    const pictureId = await checkPictureExistance(publicId);

    if (!pictureId) {
        throw new ClientError('ENTITY_NOT_FOUND', {request: req, group: 'application'});
    }

    await addView({pictureId, fingerprint});

    res.json({});
});
