import {wrap} from 'async-middleware';
import {Request, Response} from 'express';

import {addProductView} from 'entity/product/api/add-product-view';
import {checkProductExistance} from 'entity/product/api/get-product-by-code';
import {ClientError} from 'service/error';

export const view = wrap<Request, Response>(async (req, res) => {
    const fingerprint = req.context.browserFingerprint;

    if (!fingerprint) {
        req.context.logger.warn('browser fingerprint does not exists');

        return res.json({});
    }

    const {code} = req.params;

    const productId = await checkProductExistance(code);

    if (!productId) {
        throw new ClientError('ENTITY_NOT_FOUND', {
            request: req,
            group: 'application',
            message: `product with code "${code}" does not exist`
        });
    }

    await addProductView({productId, fingerprint});

    res.json({});
});
