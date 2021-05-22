import {ProductGetInfoResponse} from '@server-types/response';

import {Request} from 'common/lib/request';

async function getInfo(code: string) {
    return Request.get<ProductGetInfoResponse.Response>(`/api/v1/product/${code}/info`, {responseType: 'json'});
}

async function setView(code: string) {
    return Request.put<{}>(`/api/v1/product/${code}/view`, {responseType: 'json'});
}

async function setLike(code: string) {
    return Request.put<{}>(`/api/v1/product/${code}/like`, {responseType: 'json'});
}

export const Product = {
    getInfo,
    setView,
    setLike
};
