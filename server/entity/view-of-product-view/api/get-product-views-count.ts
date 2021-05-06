import {keyBy} from 'lodash';

import {dbManager} from 'app/lib/db-manager';
import {ViewOfProductView} from 'entity/view-of-product-view';

export async function getProductViewsCount(productIds: number[]) {
    if (productIds.length === 0) {
        return {};
    }

    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(ViewOfProductView)
        .createQueryBuilder('views')
        .where('views.productId IN (:...ids)', {ids: productIds});

    const views = await qb.getMany();

    return keyBy(views, 'productId');
}
