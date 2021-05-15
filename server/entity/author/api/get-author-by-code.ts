import {Brackets} from 'typeorm';

import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';

export async function getAuthorByCode(code: string) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder('athr')
        .leftJoinAndSelect('athr.city', 'city')
        .leftJoinAndSelect('city.country', 'country')
        .leftJoinAndSelect('athr.professions', 'prof')
        .leftJoinAndSelect('athr.products', 'product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.photos', 'productPhoto')
        .where('athr.code = :code', {code})
        .andWhere(new Brackets((qb) => qb.where('product.isSold IS FALSE').orWhere('product.isSold IS NULL')));

    const author = await qb.getOne();

    return author;
}
