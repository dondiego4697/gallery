import {ProductGetInfoResponse} from '@server-types/response';

import {Request} from 'common/lib/request';

async function getInfo(code: string) {
    return Request.get<ProductGetInfoResponse.Response>(`/api/v1/product/${code}/info`, {responseType: 'json'});
}

export const Product = {
    getInfo
};
