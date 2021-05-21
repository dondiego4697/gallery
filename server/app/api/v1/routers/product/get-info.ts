import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {pick} from 'lodash';

import {getProductByCode} from 'entity/product/api/get-product-by-code';
import {getProductLikesForUser} from 'entity/product-like/api/get-product-likes-for-user';
import {getProductViewsCount} from 'entity/view-of-product-view/api/get-product-views-count';
import {ClientError} from 'service/error';
import {ProductGetInfoResponse} from 'types/response';

export const getInfo = wrap<Request, Response>(async (req, res) => {
    const {code} = req.params;
    const product = await getProductByCode(code);

    if (!product) {
        throw new ClientError('ENTITY_NOT_FOUND', {
            request: req,
            group: 'application',
            message: `product with code "${code}" does not exist`
        });
    }

    const user = await req.context.getUser();

    const [views, likes] = await Promise.all([
        getProductViewsCount([product.id]),
        user ? getProductLikesForUser({userId: user.id, productIds: [product.id]}) : Promise.resolve(new Set<number>())
    ]);

    const {author} = product;

    const data: ProductGetInfoResponse.Response = {
        meta: {
            views: views[product.id]?.count || 0,
            isLike: likes.has(product.id)
        },
        product: {
            ...pick(product, ['code', 'name', 'description', 'size', 'data', 'price', 'isSold', 'createdAt']),
            category: pick(product.category, ['code', 'name']),
            style: product.style ? pick(product.style, ['code', 'name']) : undefined,
            material: product.material ? pick(product.material, ['code', 'name']) : undefined,
            shapeFormat: product.shapeFormat ? pick(product.shapeFormat, ['code', 'name']) : undefined,
            photos: (product.photos || []).map((it) => it.photoUrl).sort(),
            tags: (product.tags || []).map((it) => ({
                code: it.code,
                name: it.name
            }))
        },
        author: {
            avatarUrl: author.avatarUrl,
            firstName: author.firstName,
            lastName: author.lastName,
            code: author.code
        }
    };

    res.json(data);
});
