import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';

interface Params {
    poor: boolean;
}

export async function getAuthorByCode(code: string, params: Params) {
    const {poor} = params;
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder('athr')
        .leftJoinAndSelect('athr.city', 'city')
        .leftJoinAndSelect('athr.professions', 'prof')
        .leftJoinAndSelect('city.country', 'country')
        .where('athr.code = :code', {code});

    if (!poor) {
        qb.leftJoinAndSelect('athr.products', 'product')
            .leftJoinAndSelect('product.productCategory', 'productCategory')
            .leftJoinAndSelect('product.photos', 'productPhoto')
            .andWhere('product.isSold IS FALSE');
    }

    const author = await qb.getOne();

    return author;
}
