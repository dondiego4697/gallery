import {MordaMainResponse} from '@server-types/response';

import {Request} from 'common/lib/request';

async function main() {
    return Request.get<MordaMainResponse.Response>('/api/v1/morda', {}, {responseType: 'json'});
}

export const Morda = {
    main
};
