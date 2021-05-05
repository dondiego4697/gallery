import {DbView} from 'entity/const';
import {ViewColumn, ViewEntity} from 'typeorm';

@ViewEntity({name: DbView.PRODUCT_FILTERS})
export class ViewOfProductFilters {
    @ViewColumn()
    categoryCode: string;

    @ViewColumn()
    code: string;

    @ViewColumn()
    name: string;

    @ViewColumn()
    type: 'color' | 'style' | 'material' | 'shapeFormat';
}
