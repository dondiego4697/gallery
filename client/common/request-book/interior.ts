import {InteriorRandomResponse} from '@server-types/response';

import {Request} from 'common/lib/request';

async function getRandom() {
    return Request.get<InteriorRandomResponse.Response>('/api/v1/interior/random', {}, {responseType: 'json'});
}

export const Interior = {
    getRandom
};
