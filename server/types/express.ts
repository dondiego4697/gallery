/* eslint-disable @typescript-eslint/no-namespace */

import {Context} from 'app/middleware/request-context';

declare global {
    namespace Express {
        interface Request {
            nonce: string;
            context: Context;
        }
    }
}
