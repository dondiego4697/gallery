import {dbManager} from 'app/lib/db-manager';
import {PictureLike} from 'entity/picture-like';

interface Params {
    userId: number;
    pictureIds: number[];
}

export async function getPictureLikesForUser({userId, pictureIds}: Params) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(PictureLike)
        .createQueryBuilder('like')
        .where({userId})
        .andWhere('like.pictureId IN (:...pictureIds)', {pictureIds});

    const likes = await qb.getMany();

    return new Set(likes.map((it) => it.pictureId));
}
