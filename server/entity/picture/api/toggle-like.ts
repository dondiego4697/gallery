import {dbManager} from 'app/lib/db-manager';
import {PictureLike} from 'entity/picture-like';

interface Params {
    pictureId: number;
    userId: number;
}

export async function toggleLike({pictureId, userId}: Params) {
    const connection = await dbManager.getConnection();

    const like = await connection
        .getRepository(PictureLike)
        .createQueryBuilder('like')
        .select()
        .where({pictureId, userId})
        .getOne();

    const qb = connection.getRepository(PictureLike).createQueryBuilder('like');

    if (like) {
        await qb.delete().where({pictureId, userId}).execute();
    } else {
        await qb.insert().values({pictureId, userId}).onConflict('DO NOTHING').execute();
    }

    return like ? 'deleted' : 'inserted';
}
