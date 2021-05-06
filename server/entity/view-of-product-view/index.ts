import {ViewColumn, ViewEntity} from 'typeorm';

import {DbView} from 'entity/const';

@ViewEntity({name: DbView.PRODUCT_VIEW})
export class ViewOfProductView {
    @ViewColumn()
    productId: number;

    @ViewColumn()
    count: number;
}
