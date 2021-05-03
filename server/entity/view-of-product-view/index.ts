import {DbView} from 'entity/const';
import {ViewColumn, ViewEntity} from 'typeorm';

@ViewEntity({name: DbView.PRODUCT_VIEW})
export class ViewOfProductView {
    @ViewColumn()
    productId: number;

    @ViewColumn()
    count: number;
}
