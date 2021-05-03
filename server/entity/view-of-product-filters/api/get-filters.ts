import {dbManager} from 'app/lib/db-manager';
import {ViewOfProductFilters} from 'entity/view-of-product-filters';

export async function getProductFilters() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(ViewOfProductFilters).createQueryBuilder();

    return qb.getMany();
}
