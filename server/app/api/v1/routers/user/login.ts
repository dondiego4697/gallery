import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {random} from 'lodash';

import {config} from 'app/config';
import {JWT} from 'app/lib/jwt';
import {createUser} from 'entity/user/api/create-user';
import {getUserByEmail} from 'entity/user/api/get-user';
import {updateUserCode} from 'entity/user/api/update-user-code';
import {ClientError} from 'service/error';
import {CookieUserData} from 'types/cookie';

interface Body {
    email: string;
    code?: number;
}

async function sendCode(email: string, code: number, req: Request) {
    // TODO send code
    req.context.logger.info(`email: ${email}, code: ${code}`);
}

export const login = wrap<Request, Response>(async (req, res) => {
    const {code, email} = req.body as Body;

    const newCode = random(1000, 9999);
    const user = await getUserByEmail(email);

    if (!code && !user) {
        await createUser({email, code: newCode});
        sendCode(email, newCode, req);
    } else if (!code && user) {
        await updateUserCode({id: user.id, code: newCode});
        sendCode(email, newCode, req);
    } else if (code && !user) {
        throw new ClientError('ACCESS_FORBIDDEN', {
            request: req,
            group: 'application',
            message: `unknown user "${email}" with code "${code}" tried to login`
        });
    } else if (code && user) {
        if (user.code === code) {
            const userData: CookieUserData = {id: user.id};

            res.cookie(config['cookie.key.userToken'], JWT.encode(userData), {maxAge: 2 * 60 * 60 * 1000}); // 2h
        } else {
            throw new ClientError('ACCESS_FORBIDDEN', {
                request: req,
                group: 'application',
                message: `user "${email}" tried to login with wrong code "${code}"`
            });
        }
    }

    res.json({});
});
