import {DbView} from 'entity/const';
import {ViewColumn, ViewEntity} from 'typeorm';

@ViewEntity({name: DbView.PRODUCT_FILTERS})
export class ViewOfProductFilters {
    @ViewColumn()
    productCategoryId: number;

    @ViewColumn()
    productCategoryCode: string;

    @ViewColumn()
    value: string;

    @ViewColumn()
    type: 'style' | 'material' | 'shapeFormat';
}
