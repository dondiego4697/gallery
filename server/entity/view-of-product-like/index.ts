import {DbView} from 'entity/const';
import {ViewColumn, ViewEntity} from 'typeorm';

@ViewEntity({name: DbView.PRODUCT_LIKE})
export class ViewOfProductLike {
    @ViewColumn()
    productId: number;

    @ViewColumn()
    count: number;
}
