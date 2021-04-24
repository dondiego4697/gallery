import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';
import {Picture} from 'entity/picture';

interface GetAuthorPicturesParams {
    authorId: number;
    limit: number;
    offset: number;
}

export async function getAuthorByPublicId(id: string) {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Author).createQueryBuilder('athr').where({
        publicId: id
    });

    const author = await qb.getOne();

    return author;
}

export async function getAuthorPictures(params: GetAuthorPicturesParams) {
    const {limit, offset, authorId} = params;

    const connection = await dbManager.getConnection();

    return connection.getRepository(Picture).find({
        relations: ['photos', 'shape', 'style'],
        where: {authorId},
        take: limit,
        skip: offset
    });
}
