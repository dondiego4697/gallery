import {dbManager} from 'app/lib/db-manager';
import {Product} from 'entity/product';

export async function getProductByCode(code: string) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Product)
        .createQueryBuilder('p')
        .innerJoin('p.productCategory', 'pc')
        .leftJoinAndSelect('p.photos', 'photo')
        .innerJoinAndSelect('p.author', 'athr')
        .leftJoinAndSelect('athr.professions', 'prof')
        .leftJoinAndSelect('athr.city', 'city')
        .leftJoinAndSelect('city.country', 'country')
        .where('p.code = :code', {code});

    const product = await qb.getOne();

    return product;
}

export async function checkProductExistance(code: string) {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Product).createQueryBuilder().select(['id']).where({code});

    const products = await qb.execute();

    if (!products || !products[0]) {
        return;
    }

    return products[0].id;
}
