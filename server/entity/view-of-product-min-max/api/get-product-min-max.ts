import {dbManager} from 'app/lib/db-manager';
import {ViewOfProductMinMax} from 'entity/view-of-product-min-max';

export async function getProductMinMax() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(ViewOfProductMinMax).createQueryBuilder();

    return qb.getOne();
}
