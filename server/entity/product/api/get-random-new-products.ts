import {dbManager} from 'app/lib/db-manager';
import {Product} from 'entity/product';

interface Params {
    limit: number;
}

async function getRandomProductIds(limit: number) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .createQueryBuilder()
        .select('subp.id')
        .from((qb) => {
            return qb
                .select('pr.id', 'id')
                .from(Product, 'pr')
                .orderBy('pr.createdAt', 'DESC')
                .where('pr.isSold IS FALSE')
                .limit(100);
        }, 'subp')
        .orderBy('RANDOM()')
        .limit(limit);

    const result = await qb.getRawMany();

    return result.map((it) => it.id) as number[];
}

export async function getRandomNewProducts({limit}: Params) {
    const ids = await getRandomProductIds(limit);
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Product)
        .createQueryBuilder('p')
        .innerJoinAndSelect('p.author', 'athr')
        .leftJoinAndSelect('p.photos', 'photo')
        .where('p.id IN (:...ids)', {ids});

    return qb.getMany();
}
