import {Request} from 'common/lib/request';

export interface MordaMainResponse {
    authors: {
        code: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
        professions: string[];
    }[];
    products: {
        code: string;
        name: string;
        price: number;
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
    }[];
}

async function main() {
    return Request.get<MordaMainResponse>('/api/v1/morda', {responseType: 'json'});
}

export const Morda = {
    main
};
