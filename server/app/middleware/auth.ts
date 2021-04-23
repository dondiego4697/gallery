import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {config} from 'app/config';
import {JWT} from 'app/lib/jwt';
import {CookieUserData} from 'types/cookie';
import {ClientError} from 'service/error';

function getUserFromToken(token: string, req: Request) {
    try {
        return JWT.decode<CookieUserData>(token);
    } catch (error) {
        throw new ClientError('BAD_USER_TOKEN', {group: 'jwt', request: req, message: error.message});
    }
}

export const auth = wrap<Request, Response>(async (req, _res, next) => {
    // TODO https://www.npmjs.com/package/fingerprintjs2

    const userToken = req.cookies[config['cookie.key.userToken']];
    const fingerprint = req.cookies[config['cookie.key.fingerprint']];

    if (userToken) {
        const user = getUserFromToken(userToken, req);

        req.user = {id: user.id};
    }

    if (fingerprint) {
        req.browserFingerprint = fingerprint;
    }

    next();
});
