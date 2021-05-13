import {dbManager} from 'app/lib/db-manager';
import {Selection} from 'entity/selection';

export async function getAllSelections() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(Selection).find({
        relations: [],
        where: {isActive: true},
        order: {path: 'ASC'}
    });
}
