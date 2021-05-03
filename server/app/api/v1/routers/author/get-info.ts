import {omit, sortBy} from 'lodash';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getAuthorByCode} from 'entity/author/api/get-author-by-code';
import {ClientError} from 'service/error';
import {getProductLikesForUser} from 'entity/product-like/api/get-product-likes-for-user';
import {getProductViewsCount} from 'entity/view-of-product-view/api/get-product-views-count';

interface Query {
    poor: boolean;
}

export const getInfo = wrap<Request, Response>(async (req, res) => {
    const {poor} = (req.query as unknown) as Query;
    const {code} = req.params;

    const author = await getAuthorByCode(code, {poor});

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

    res.json({
        ...omit(author, ['id', 'cityId', 'city.id', 'city.countryId', 'city.country.id']),
        professions: (author.professions || []).map((it) => omit(it, 'id')),
        products: sortBy(
            products.map((it) => {
                const product = omit(it, ['id', 'authorId', 'productCategoryId', 'productCategory.id']);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (product as any).views = views[it.id]?.count || 0;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (product as any).photos = it.photos.map((it: any) => it.photoUrl);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (product as any).isLike = likes.has(it.id);

                return product;
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (it: any) => -it.views
        )
    });
});
