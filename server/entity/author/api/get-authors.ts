import {ILike} from 'typeorm';

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

    const [authors, totalCount] = await connection.getRepository(Author).findAndCount({
        relations: ['city', 'city.country', 'products', 'products.photos'],
        where: searchQuery
            ? [{firstName: ILike(`%${searchQuery}%`)}, {lastName: ILike(`%${searchQuery}%`)}]
            : searchFirstLetter
            ? [{lastName: ILike(`${searchFirstLetter}%`)}]
            : undefined,
        skip: offset,
        take: limit,
        order: {
            firstName: 'ASC'
        }
    });

    return {authors, totalCount};
}
