import {dbManager} from 'app/lib/db-manager';
import {Product} from 'entity/product';
import {Brackets} from 'typeorm';
import {MinMax} from 'types/query';

interface Params {
    limit: number;
    offset: number;
    intervalFilters: {
        price?: MinMax;
        width?: MinMax;
        height?: MinMax;
        length?: MinMax;
    };
    codeFilters: {
        category?: string;
        selection?: string;
        styles: string[];
        shapeFormats: string[];
        colors: string[];
    };
}

export async function getProductsByFilters(params: Params) {
    const {limit, offset, intervalFilters, codeFilters} = params;

    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Product)
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.category', 'category')
        .leftJoinAndSelect('p.style', 'style')
        .leftJoinAndSelect('p.material', 'material')
        .leftJoinAndSelect('p.shapeFormat', 'shapeformat')
        .leftJoinAndSelect('p.colors', 'color')
        .leftJoinAndSelect('p.selections', 'selection')
        .where('p.isSold IS FALSE');

    if (codeFilters.category) {
        qb.andWhere('category.code = :category', {category: codeFilters.category});
    }

    if (codeFilters.selection) {
        qb.andWhere('selection.code = :selection', {selection: codeFilters.selection});
    }

    if (codeFilters.styles.length > 0) {
        qb.andWhere('style.code IN (:...styles)', {styles: codeFilters.styles});
    }

    if (codeFilters.shapeFormats.length > 0) {
        qb.andWhere('shapeformat.code IN (:...shapeFormats)', {shapeFormats: codeFilters.shapeFormats});
    }

    if (codeFilters.colors.length > 0) {
        qb.andWhere('color.code IN (:...colors)', {colors: codeFilters.colors});
    }

    if (intervalFilters.price?.min || intervalFilters.price?.max) {
        const {min, max} = intervalFilters.price;

        if (min || min === 0) {
            qb.andWhere('p.price >= :minPrice', {minPrice: min});
        }

        if (max || max === 0) {
            qb.andWhere('p.price <= :maxPrice', {maxPrice: max});
        }
    }

    if (intervalFilters.width?.min || intervalFilters.width?.max) {
        const {min, max} = intervalFilters.width;

        if (min || min === 0) {
            qb.andWhere("(p.size ->> 'width')::int >= :minWidth", {minWidth: min});
        }

        if (max || max === 0) {
            qb.andWhere("(p.size ->> 'width')::int <= :maxWidth", {maxWidth: max});
        }
    }

    if (intervalFilters.height?.min || intervalFilters.height?.max) {
        const {min, max} = intervalFilters.height;

        if (min || min === 0) {
            qb.andWhere("(p.size ->> 'height')::int >= :minHeight", {minHeight: min});
        }

        if (max || max === 0) {
            qb.andWhere("(p.size ->> 'height')::int <= :maxHeight", {maxHeight: max});
        }
    }

    if (intervalFilters.length?.min || intervalFilters.length?.max) {
        const {min, max} = intervalFilters.length;

        if (min || min === 0) {
            qb.andWhere(
                new Brackets((qb) => {
                    qb.where("(p.size ->> 'length') IS NULL").orWhere("(p.size ->> 'length')::int <= :minLength", {
                        minLength: min
                    });
                })
            );
        }

        if (max || max === 0) {
            qb.andWhere(
                new Brackets((qb) => {
                    qb.where("(p.size ->> 'length') IS NULL").orWhere("(p.size ->> 'length')::int <= :maxLength", {
                        maxLength: max
                    });
                })
            );
        }
    }

    const [products, totalCount] = await qb
        .take(limit)
        .skip(offset)
        .orderBy({
            'p.createdAt': 'DESC'
        })
        .getManyAndCount();

    return {products, totalCount};
}
