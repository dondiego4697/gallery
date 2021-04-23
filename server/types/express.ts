/* eslint-disable @typescript-eslint/no-namespace */

import {Logger} from 'winston';

interface User {
    id: number;
}

declare global {
    namespace Express {
        interface Request {
            nonce: string;
            requestId: string;
            logger: Logger;
            user?: User;
            browserFingerprint?: string;
        }
    }
}
