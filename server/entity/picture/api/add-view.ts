import {dbManager} from 'app/lib/db-manager';
import {Picture} from 'entity/picture';
import {PictureView} from 'entity/picture-view';
import {ClientError} from 'service/error';

interface Params {
    pictureId: string;
    fingerprint: string;
}

export async function addView({pictureId, fingerprint}: Params) {
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

    await connection
        .getRepository(PictureView)
        .createQueryBuilder('view')
        .insert()
        .values({
            pictureId: picture.id,
            fingerprint
        })
        .onConflict('DO NOTHING')
        .execute();
}
