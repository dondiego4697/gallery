import jwt from 'jsonwebtoken';
import {config} from 'app/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function encode(payload: any) {
    return jwt.sign(payload, config['private.key']);
}

function decode<T>(token: string) {
    const data = jwt.verify(token, config['private.key']);

    return (data as unknown) as T;
}

export const JWT = {
    encode,
    decode
};
