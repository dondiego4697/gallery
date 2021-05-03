import {dbManager} from 'app/lib/db-manager';
import {ProductLike} from 'entity/product-like';

interface Params {
    productId: number;
    userId: number;
}

export async function toggleProductLike({productId, userId}: Params) {
    const connection = await dbManager.getConnection();

    const like = await connection
        .getRepository(ProductLike)
        .createQueryBuilder()
        .select()
        .where({productId, userId})
        .getOne();

    const qb = connection.getRepository(ProductLike).createQueryBuilder();

    if (like) {
        await qb.delete().where({productId, userId}).execute();
    } else {
        await qb.insert().values({productId, userId}).onConflict('DO NOTHING').execute();
    }

    return like ? 'deleted' : 'inserted';
}
