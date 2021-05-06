import {ViewColumn, ViewEntity} from 'typeorm';

import {DbView} from 'entity/const';

@ViewEntity({name: DbView.PRODUCT_LIKE})
export class ViewOfProductLike {
    @ViewColumn()
    productId: number;

    @ViewColumn()
    count: number;
}
