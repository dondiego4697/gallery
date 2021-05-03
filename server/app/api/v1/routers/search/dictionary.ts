import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getProductFilters} from 'entity/view-of-product-filters/api/get-filters';
import {Dictionary, sortBy, get, set} from 'lodash';

export const dictionary = wrap<Request, Response>(async (_req, res) => {
    const filters = await getProductFilters();

    const result: Dictionary<Dictionary<string[]>> = {};

    filters.forEach((it) => {
        const key: [string, string] = [it.productCategoryCode, it.type];
        const items = get(result, key);

        if (items) {
            items.push(it.value);
            set(
                result,
                key,
                sortBy(items, (it) => it.toLowerCase())
            );
        } else {
            set(result, key, [it.value]);
        }
    });

    res.json(result);
});
