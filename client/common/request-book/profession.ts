import {ProfessionGetListResponse} from '@server-types/response';

import {Request} from 'common/lib/request';

async function getList() {
    return Request.get<ProfessionGetListResponse.Response>('/api/v1/profession', {}, {responseType: 'json'});
}

export const Profession = {
    getList
};
