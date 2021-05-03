import {dbManager} from 'app/lib/db-manager';
import {ProductView} from 'entity/product-view';

interface Params {
    productId: number;
    fingerprint: string;
}

export async function addProductView({productId, fingerprint}: Params) {
    const connection = await dbManager.getConnection();

    await connection
        .getRepository(ProductView)
        .createQueryBuilder()
        .insert()
        .values({
            productId,
            fingerprint
        })
        .onConflict('DO NOTHING')
        .execute();
}
