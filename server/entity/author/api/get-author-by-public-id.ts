import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';
import {DbTable} from 'entity/const';

export async function getAuthorByPublicId(id: string) {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Author).createQueryBuilder(DbTable.AUTHOR).where({
        publicId: id
    });

    const author = await qb.getOne();

    return author;
}

export async function getAuthorByPublicIdWithPictures(id: string, limit: number, offset: number) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder(DbTable.AUTHOR)
        .leftJoinAndSelect(`${DbTable.AUTHOR}.pictures`, DbTable.PICTURE)
        .innerJoinAndSelect(`${DbTable.PICTURE}.shape`, DbTable.PICTURE_SHAPE)
        .innerJoinAndSelect(`${DbTable.PICTURE}.style`, DbTable.PICTURE_STYLE)
        .where(`${DbTable.AUTHOR}.publicId = :id`, {id})
        .limit(limit)
        .offset(offset)
        .orderBy(`${DbTable.PICTURE}.createdAt`, 'DESC');

    const author = await qb.getOne();

    return author;
}
