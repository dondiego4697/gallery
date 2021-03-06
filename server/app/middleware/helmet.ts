import {randomBytes} from 'crypto';
import {NextFunction, Request, Response} from 'express';
import _helmet from 'helmet';

import {directives} from 'app/csp';

export const helmet = [
    (req: Request, _res: Response, next: NextFunction): void => {
        req.nonce = randomBytes(16).toString('base64');
        next();
    },
    _helmet({
        xssFilter: false,
        contentSecurityPolicy: {
            directives: {
                ...directives,
                scriptSrc: [
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ...(directives?.scriptSrc ? (directives.scriptSrc as any[]) : []),
                    (req: Request) => `'nonce-${req.nonce}'`
                ]
            }
        }
    })
];
