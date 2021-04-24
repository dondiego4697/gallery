import {dbManager} from 'app/lib/db-manager';
import {User} from 'entity/user';

export async function getUserById(id: number) {
    const connection = await dbManager.getConnection();

    return connection.getRepository(User).createQueryBuilder('usr').where({id}).getOne();
}
