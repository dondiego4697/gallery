import {Logger} from 'winston';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {v4 as uuidv4} from 'uuid';
import {config} from 'app/config';
import {logger as _logger} from 'service/logger';
import {JWT} from 'app/lib/jwt';
import {CookieUserData} from 'types/cookie';
import {ClientError} from 'service/error';
import {getUserById} from 'entity/user/api/get-user-by-id';

const REQUEST_ID = config['header.requestId'];

export class Context {
    readonly requestId: string;
    readonly logger: Logger;
    readonly browserFingerprint?: string;
    protected readonly cookieUserData?: CookieUserData;

    constructor(req: Request, res: Response) {
        this.requestId = (req.headers[REQUEST_ID] as string | undefined) || uuidv4();

        res.setHeader(REQUEST_ID, this.requestId);

        this.logger = _logger.child({
            hostname: req.hostname,
            originalUrl: req.originalUrl,
            requestId: this.requestId
        });

        const userToken = req.cookies[config['cookie.key.userToken']];
        const fingerprint = req.cookies[config['cookie.key.fingerprint']];

        if (userToken) {
            this.cookieUserData = this.getUserFromToken(userToken, req);
        }

        if (fingerprint) {
            this.browserFingerprint = fingerprint;
        }
    }

    protected getUserFromToken(token: string, req: Request) {
        try {
            return JWT.decode<CookieUserData>(token);
        } catch (error) {
            throw new ClientError('BAD_USER_TOKEN', {group: 'jwt', request: req, message: error.message});
        }
    }

    public async getUser() {
        if (!this.cookieUserData) {
            return;
        }

        const user = await getUserById(this.cookieUserData.id);

        if (!user) {
            // TODO надо сбрасывать куку user_token
        }

        return user;
    }
}

export const requestContext = wrap<Request, Response>(async (req, res, next) => {
    req.context = new Context(req, res);

    next();
});
