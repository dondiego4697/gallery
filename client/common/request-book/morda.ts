import {Request} from 'common/lib/request';

export namespace MordaMainResponse {
    export interface Response {
        authors: Author[];
        products: Product[];
        selections: Selection[];
    }

    export interface Author {
        code: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
        professions: string[];
    }

    export interface Selection {
        code: string;
        name: string;
        description?: string;
        imageUrl: string;
    }

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
}

async function main() {
    return Request.get<MordaMainResponse.Response>('/api/v1/morda', {responseType: 'json'});
}

export const Morda = {
    main
};
