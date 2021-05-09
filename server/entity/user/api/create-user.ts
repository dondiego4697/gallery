import {dbManager} from 'app/lib/db-manager';
import {User} from 'entity/user';

interface Params {
    email: string;
    code?: number;
    isAdmin?: boolean;
}

export async function createUser(params: Params) {
    const {email, code, isAdmin} = params;
    const {manager} = await dbManager.getConnection();

    const user = manager.create(User, {email, code, isAdmin: isAdmin || false});

    await manager.save(user);

    return user;
}
