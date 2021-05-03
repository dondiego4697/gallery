import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {ClientError} from 'service/error';
import {toggleProductLike} from 'entity/product/api/toggle-product-like';
import {checkProductExistance} from 'entity/product/api/get-product-by-code';

export const like = wrap<Request, Response>(async (req, res) => {
    const user = await req.context.getUser();

    if (!user) {
        throw new ClientError('UNAUTHORIZED', {request: req, group: 'application'});
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

    const result = await toggleProductLike({productId, userId: user.id});

    res.json({result});
});
