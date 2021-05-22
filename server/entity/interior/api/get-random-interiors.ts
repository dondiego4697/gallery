import {dbManager} from 'app/lib/db-manager';
import {Interior} from 'entity/interior';

export async function getRandomInteriors(limit: number) {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Interior).createQueryBuilder('intr').orderBy('RANDOM()').take(limit);

    return qb.getMany();
}
