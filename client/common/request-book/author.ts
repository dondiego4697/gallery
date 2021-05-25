import {AuthorGetInfoResponse, AuthorGetListResponse} from '@server-types/response';

import {Request} from 'common/lib/request';

interface GetListParams {
    limit: number;
    offset: number;
    firstLetter?: string;
    searchQuery?: string;
    professionCode?: string;
}

async function getInfo(code: string) {
    return Request.get<AuthorGetInfoResponse.Response>(`/api/v1/author/${code}/info`, {}, {responseType: 'json'});
}

async function getList(params: GetListParams) {
    return Request.get<AuthorGetListResponse.Response>(
        '/api/v1/author',
        {
            limit: params.limit,
            offset: params.offset,
            searchFirstLetter: params.firstLetter,
            professionCode: params.professionCode,
            searchQuery: params.searchQuery
        },
        {
            responseType: 'json'
        }
    );
}

export const Author = {
    getInfo,
    getList
};
