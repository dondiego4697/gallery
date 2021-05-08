import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';

interface Params {
    limit: number;
}

async function getRandomAuthorIds(limit: number) {
    const connection = await dbManager.getConnection();

    const qb = connection.createQueryBuilder().select('athr.id').from(Author, 'athr').orderBy('RANDOM()').limit(limit);

    const result = await qb.getMany();

    return result.map((it) => it.id);
}

export async function getRandomAuthors({limit}: Params) {
    const ids = await getRandomAuthorIds(limit);
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder('athr')
        .leftJoinAndSelect('athr.professions', 'prof')
        .where('athr.id IN (:...ids)', {ids})
        .take(limit);

    return qb.getMany();
}
