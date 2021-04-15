import {Struct, Infer} from 'superstruct';
import Boom from '@hapi/boom';

export function validateStruct<T, S>(struct: Struct<T, S>, data: unknown): Infer<Struct<T, S>> {
    const [error, value] = struct.validate(data);

    if (typeof error !== 'undefined') {
        throw Boom.badRequest(error.message);
    }

    return value as T;
}
