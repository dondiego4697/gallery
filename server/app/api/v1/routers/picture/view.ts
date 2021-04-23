import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {addView} from 'entity/picture/api/add-view';

export const view = wrap<Request, Response>(async (req, res) => {
    if (!req.browserFingerprint) {
        req.logger.warn('browser fingerprint does not exists');

        return res.json({});
    }

    const {id} = req.params;

    await addView({pictureId: id, fingerprint: req.browserFingerprint});

    res.json({});
});
