import {dbManager} from 'app/lib/db-manager';
import {Picture} from 'entity/picture';
import {PictureLike} from 'entity/picture-like';
import {ClientError} from 'service/error';

interface Params {
    pictureId: string;
    userId: number;
}

export async function toggleLike({pictureId, userId}: Params) {
    const connection = await dbManager.getConnection();

    const picture = await connection
        .getRepository(Picture)
        .createQueryBuilder('pic')
        .select()
        .where({publicId: pictureId})
        .getOne();

    if (!picture) {
        throw new ClientError('ENTITY_NOT_FOUND');
    }

    const like = await connection
        .getRepository(PictureLike)
        .createQueryBuilder('like')
        .select()
        .where({pictureId: picture.id, userId})
        .getOne();

    const qb = connection.getRepository(PictureLike).createQueryBuilder('like');

    if (like) {
        await qb
            .delete()
            .where({
                pictureId: picture.id,
                userId
            })
            .execute();
    } else {
        await qb
            .insert()
            .values({
                pictureId: picture.id,
                userId
            })
            .onConflict('DO NOTHING')
            .execute();
    }

    return like ? 'deleted' : 'inserted';
}
