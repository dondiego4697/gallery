import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';

interface GetAuthorPicturesParams {
    id: string;
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

export async function getAuthorByPublicIdWithPictures(params: GetAuthorPicturesParams) {
    const {limit, offset, id} = params;

    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder('athr')
        .leftJoinAndSelect('athr.pictures', 'pic')
        .innerJoinAndSelect('pic.shape', 'picShape')
        .innerJoinAndSelect('pic.style', 'picStyle')
        .where('athr.publicId = :id', {id})
        .limit(limit)
        .offset(offset)
        .orderBy('pic.createdAt', 'DESC');

    const author = await qb.getOne();

    return author;
}
