import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {pick} from 'lodash';

import {getRandomAuthors} from 'entity/author/api/get-random-authors';
import {getRandomNewProducts} from 'entity/product/api/get-random-new-products';
import {getProductLikesForUser} from 'entity/product-like/api/get-product-likes-for-user';
import {getProductViewsCount} from 'entity/view-of-product-view/api/get-product-views-count';

export const main = wrap<Request, Response>(async (req, res) => {
    const [authors, products] = await Promise.all([getRandomAuthors({limit: 6}), getRandomNewProducts({limit: 12})]);

    const user = await req.context.getUser();
    const productIds = products.map((it) => it.id);

    const [views, likes] = await Promise.all([
        getProductViewsCount(productIds),
        user ? getProductLikesForUser({userId: user.id, productIds}) : Promise.resolve(new Set<number>())
    ]);

    res.json({
        authors: authors.map((author) => ({
            ...pick(author, ['code', 'firstName', 'lastName', 'avatarUrl']),
            professions: author.professions.map((prof) => prof.name)
        })),
        products: products.map((product) => ({
            ...pick(product, ['code', 'name', 'size', 'price', 'author.firstName', 'author.lastName']),
            photos: product.photos.map((it) => it.photoUrl),
            meta: {
                views: views[product.id]?.count || 0,
                isLike: likes.has(product.id)
            }
        }))
    });
});
