import {keyBy} from 'lodash';
import {dbManager} from 'app/lib/db-manager';
import {ViewOfPictureView} from 'entity/view-of-picture-view';

export async function getViewsCount(pictureIds: number[]) {
    const connection = await dbManager.getConnection();

    const qb = connection
        .getRepository(ViewOfPictureView)
        .createQueryBuilder('views')
        .where('views.pictureId IN (:...ids)', {ids: pictureIds});

    const views = await qb.getMany();

    return keyBy(views, 'pictureId');
}
