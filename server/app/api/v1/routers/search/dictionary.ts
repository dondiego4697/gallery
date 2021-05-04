import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getProductFilters} from 'entity/view-of-product-filters/api/get-filters';
import {Dictionary, sortBy, get, set} from 'lodash';

interface Item {
    code: string;
    name: string;
}

export const dictionary = wrap<Request, Response>(async (_req, res) => {
    const filters = await getProductFilters();

    const result: Dictionary<Dictionary<Item[]>> = {};

    filters.forEach((it) => {
        const key: [string, string] = [it.categoryCode, it.type];
        const items = get(result, key);

        if (items) {
            items.push({code: it.code, name: it.name});

            set(
                result,
                key,
                sortBy(items, (it) => it.name.toLowerCase())
            );
        } else {
            set(result, key, [{code: it.code, name: it.name}]);
        }
    });

    res.json(result);
});
