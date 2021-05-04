import {pick} from 'lodash';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getProductByCode} from 'entity/product/api/get-product-by-code';
import {ClientError} from 'service/error';
import {getProductViewsCount} from 'entity/view-of-product-view/api/get-product-views-count';
import {getProductLikesForUser} from 'entity/product-like/api/get-product-likes-for-user';

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

    res.json({
        meta: {
            views: views[product.id]?.count || 0,
            isLike: likes.has(product.id)
        },
        product: {
            ...pick(product, [
                'code',
                'name',
                'size',
                'data',
                'price',
                'isSold',
                'style',
                'material',
                'shapeFormat',
                'createdAt'
            ]),
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
    });
});
