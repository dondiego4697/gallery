import {Request} from 'common/lib/request';

export namespace AuthorGetInfoResponse {
    export interface Response {
        author: Author;
        products: Product[];
    }

    export interface Product {
        code: string;
        name: string;
        price: number;
        releaseYear?: number;
        photo?: string;
        size: {
            width: number;
            height: number;
            length?: number;
        };
        meta: {
            views: number;
            isLike: boolean;
        };
    }

    export interface Author {
        code: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
        bio?: string;
        professions: string[];
        createdAt: Date;
        city: {
            code?: string;
            name?: string;
        };
        country: {
            code?: string;
            name?: string;
        };
    }
}

async function getInfo(code: string) {
    return Request.get<AuthorGetInfoResponse.Response>(`/api/v1/author/${code}/info`, {responseType: 'json'});
}

export const Author = {
    getInfo
};
