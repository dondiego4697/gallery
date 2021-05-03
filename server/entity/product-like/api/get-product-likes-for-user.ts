import {dbManager} from 'app/lib/db-manager';
import {ProductLike} from 'entity/product-like';

interface Params {
    userId: number;
    productIds: number[];
}

export async function getProductLikesForUser({userId, productIds}: Params) {
    if (productIds.length === 0) {
        return new Set<number>();
    }

    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(ProductLike)
        .createQueryBuilder('like')
        .where({userId})
        .andWhere('like.productId IN (:...ids)', {ids: productIds});

    const likes = await qb.getMany();

    return new Set(likes.map((it) => it.productId));
}
