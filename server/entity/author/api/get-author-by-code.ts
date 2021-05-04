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
        .leftJoinAndSelect('product.productCategory', 'productCategory')
        .leftJoinAndSelect('product.photos', 'productPhoto')
        .where('athr.code = :code', {code})
        .andWhere('product.isSold IS FALSE');

    const author = await qb.getOne();

    return author;
}
