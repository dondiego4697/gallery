import {ViewColumn, ViewEntity} from 'typeorm';

import {DbView} from 'entity/const';

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
