import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';

interface Params {
    limit: number;
    offset: number;
    searchFirstLetter?: string;
    searchQuery?: string;
}

export async function getAuthors({limit, offset, searchFirstLetter, searchQuery}: Params) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder('athr')
        .leftJoinAndSelect('athr.city', 'city')
        .leftJoinAndSelect('city.country', 'country')
        .limit(limit)
        .offset(offset)
        .orderBy('athr.firstName', 'ASC');

    if (searchQuery) {
        const query = `%${searchQuery}%`;

        qb.where('athr.firstName ILIKE :query', {query}).orWhere('athr.lastName ILIKE :query', {query});
    } else if (searchFirstLetter) {
        const query = `${searchFirstLetter}%`;

        qb.where('athr.lastName ILIKE :query', {query});
    }

    const [authors, totalCount] = await qb.getManyAndCount();

    return {authors, totalCount};
}
