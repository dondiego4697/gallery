import {dbManager} from 'app/lib/db-manager';
import {PictureView} from 'entity/picture-view';

interface Params {
    pictureId: number;
    fingerprint: string;
}

export async function addView({pictureId, fingerprint}: Params) {
    const connection = await dbManager.getConnection();

    await connection
        .getRepository(PictureView)
        .createQueryBuilder('view')
        .insert()
        .values({
            pictureId,
            fingerprint
        })
        .onConflict('DO NOTHING')
        .execute();
}
