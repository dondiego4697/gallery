import {Request} from 'common/lib/request';

export interface Product {
    code: string;
    name: string;
    price: number;
    releaseYear?: number;
    photos: string[];
    size: {
        width: number;
        height: number;
        length?: number;
    };
    meta: {
        views: number;
        isLike: boolean;
    };
    author: {
        firstName: string;
        lastName: string;
    };
}

export interface Author {
    code: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    professions: string[];
}

export interface MordaMainResponse {
    authors: Author[];
    products: Product[];
}

async function main() {
    return Request.get<MordaMainResponse>('/api/v1/morda', {responseType: 'json'});
}

export const Morda = {
    main
};
