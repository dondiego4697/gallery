import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getProductsByFilters} from 'entity/product/api/get-products-by-filters';
import {MinMax} from 'types/query';

interface Body {
    limit: number;
    offset: number;
    filters: {
        price?: MinMax;
        width?: MinMax;
        height?: MinMax;
        length?: MinMax;
        categoryCode?: string;
        selectionCode?: string;
        styleCodes: string[];
        shapeFormatCodes: string[];
        colorCodes: string[];
    };
}

export const filters = wrap<Request, Response>(async (req, res) => {
    const {limit, offset, filters} = req.body as Body;

    const {products, totalCount} = await getProductsByFilters({
        limit,
        offset,
        intervalFilters: {
            price: filters.price,
            width: filters.width,
            height: filters.height,
            length: filters.length
        },
        codeFilters: {
            category: filters.categoryCode,
            selection: filters.selectionCode,
            styles: filters.styleCodes,
            shapeFormats: filters.shapeFormatCodes,
            colors: filters.colorCodes
        }
    });

    res.json({
        totalCount,
        products: products.map((product) => ({
            ...product
        }))
    });
});
