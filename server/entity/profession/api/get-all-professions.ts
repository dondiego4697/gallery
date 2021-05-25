import {dbManager} from 'app/lib/db-manager';
import {Profession} from 'entity/profession';

export async function getAllProfessions() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(Profession).find({
        relations: [],
        order: {name: 'ASC'}
    });
}
