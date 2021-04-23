import {random} from 'lodash';
import {dbManager} from 'app/lib/db-manager';
import {User} from 'entity/user';

export async function createUser() {
    const {manager} = await dbManager.getConnection();

    const user = manager.create(User, {
        email: `some_user${random(1000000)}@mail.ru`
    });

    await manager.save(user);

    return user;
}
