import {dbManager} from 'app/lib/db-manager';
import {Profession} from 'entity/profession';

export async function getProfessionByCode(code: string) {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Profession).createQueryBuilder('p').where('p.code = :code', {code});

    const profession = await qb.getOne();

    return profession;
}
