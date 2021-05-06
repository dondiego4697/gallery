import {wrap} from 'async-middleware';
import {Request, Response} from 'express';

import {config} from 'app/config';
import {JWT} from 'app/lib/jwt';
import {createUser} from 'entity/user/api/create-user';
import {CookieUserData} from 'types/cookie';

export const login = wrap<Request, Response>(async (_req, res) => {
    const user = await createUser();

    const userData: CookieUserData = {id: user.id};

    res.cookie(config['cookie.key.userToken'], JWT.encode(userData), {maxAge: 2 * 60 * 60 * 1000}); // 2h

    res.json({});
});
