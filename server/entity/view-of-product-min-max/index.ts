import {DbView} from 'entity/const';
import {ViewColumn, ViewEntity} from 'typeorm';

@ViewEntity({name: DbView.PRODUCT_MIN_MAX})
export class ViewOfProductMinMax {
    @ViewColumn()
    maxPrice: number;

    @ViewColumn()
    minPrice: number;

    @ViewColumn()
    maxWidth: number;

    @ViewColumn()
    minWidth: number;

    @ViewColumn()
    maxHeight: number;

    @ViewColumn()
    minHeight: number;

    @ViewColumn()
    maxLength: number;

    @ViewColumn()
    minLength: number;
}
