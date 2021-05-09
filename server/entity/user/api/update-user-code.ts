import {dbManager} from 'app/lib/db-manager';
import {User} from 'entity/user';

interface Params {
    id: number;
    code: number;
}

export async function updateUserCode(params: Params) {
    const {code, id} = params;
    const connection = await dbManager.getConnection();

    await connection.createQueryBuilder().update(User).set({code}).where({id}).execute();
}
