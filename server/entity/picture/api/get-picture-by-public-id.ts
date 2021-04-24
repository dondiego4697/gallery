import {dbManager} from 'app/lib/db-manager';
import {Picture} from 'entity/picture';

export async function getPictureByPublicId(id: string) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(Picture)
        .createQueryBuilder('pic')
        .leftJoinAndSelect('pic.photos', 'photo')
        .innerJoinAndSelect('pic.author', 'athr')
        .innerJoinAndSelect('pic.shape', 'picShape')
        .innerJoinAndSelect('pic.style', 'picStyle')
        .where('pic.publicId = :id', {id});

    const picture = await qb.getOne();

    return picture;
}

export async function checkPictureExistance(id: string) {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Picture).createQueryBuilder('pic').select(['id']).where({publicId: id});

    const pictures = await qb.execute();

    if (!pictures || !pictures[0]) {
        return;
    }

    return pictures[0].id;
}
