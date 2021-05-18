import {AuthorGetInfoResponse} from '@server-types/response';

import {Request} from 'common/lib/request';

async function getInfo(code: string) {
    return Request.get<AuthorGetInfoResponse.Response>(`/api/v1/author/${code}/info`, {responseType: 'json'});
}

export const Author = {
    getInfo
};
