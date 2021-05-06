import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {Dictionary, get, set, sortBy} from 'lodash';

import {getProductFilters} from 'entity/view-of-product-filters/api/get-product-filters';
import {getProductMinMax} from 'entity/view-of-product-min-max/api/get-product-min-max';

interface Item {
    code: string;
    name: string;
}

export const dictionary = wrap<Request, Response>(async (_req, res) => {
    const [filtersRaw, minMax] = await Promise.all([getProductFilters(), getProductMinMax()]);

    const filters: Dictionary<Dictionary<Item[]>> = {};

    filtersRaw.forEach((it) => {
        const key: [string, string] = [it.categoryCode, it.type];
        const items = get(filters, key);

        if (items) {
            items.push({code: it.code, name: it.name});

            set(
                filters,
                key,
                sortBy(items, (it) => it.name.toLowerCase())
            );
        } else {
            set(filters, key, [{code: it.code, name: it.name}]);
        }
    });

    res.json({
        minMax,
        filters
    });
});
