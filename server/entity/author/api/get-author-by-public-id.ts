import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';

export async function getAuthorByPublicId(id: string) {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Author).createQueryBuilder('author').where({
        publicId: id
    });

    const author = await qb.getOne();

    return author;
}
