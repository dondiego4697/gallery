import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';

interface Params {
    limit: number;
    offset: number;
}

export async function getAuthors({limit, offset}: Params) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder('athr')
        .limit(limit)
        .offset(offset)
        .orderBy('created_at', 'DESC');

    const [authors, totalCount] = await qb.getManyAndCount();

    return {authors, totalCount};
}
