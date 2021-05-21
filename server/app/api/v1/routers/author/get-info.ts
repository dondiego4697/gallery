import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {pick, sortBy} from 'lodash';

import {getAuthorByCode} from 'entity/author/api/get-author-by-code';
import {getProductLikesForUser} from 'entity/product-like/api/get-product-likes-for-user';
import {getProductViewsCount} from 'entity/view-of-product-view/api/get-product-views-count';
import {ClientError} from 'service/error';
import {AuthorGetInfoResponse} from 'types/response';

export const getInfo = wrap<Request, Response>(async (req, res) => {
    const {code} = req.params;

    const author = await getAuthorByCode(code);

    if (!author) {
        throw new ClientError('ENTITY_NOT_FOUND', {
            request: req,
            group: 'application',
            message: `author with code "${code}" does not exist`
        });
    }

    const products = author.products || [];
    const productIds = products.map((it) => it.id);

    const user = await req.context.getUser();

    const [views, likes] = await Promise.all([
        getProductViewsCount(productIds),
        user ? getProductLikesForUser({userId: user.id, productIds}) : Promise.resolve(new Set<number>())
    ]);

    const data: AuthorGetInfoResponse.Response = {
        author: {
            ...pick(author, ['code', 'firstName', 'lastName', 'bio', 'avatarUrl', 'createdAt']),
            city: {
                code: author.city?.code,
                name: author.city?.name
            },
            country: {
                code: author.city?.country.code,
                name: author.city?.country.name
            },
            professions: (author.professions || []).map((it) => it.name)
        },
        products: sortBy(
            products.map((product) => ({
                ...pick(product, ['code', 'name', 'price', 'isSold', 'size', 'releaseYear']),
                photo: (product.photos || []).map((it) => it.photoUrl).sort()[0],
                meta: {
                    views: views[product.id]?.count || 0,
                    isLike: likes.has(product.id)
                }
            })),
            (it) => -it.meta.views
        )
    };

    res.json(data);
});
