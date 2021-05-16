import {Request} from 'common/lib/request';

export namespace ProductGetInfoResponse {
    export interface Response {
        author: Author;
        product: Product;
        meta: Meta;
    }

    export interface Product {
        code: string;
        name: string;
        price: number;
        releaseYear?: number;
        isSold: boolean;
        createdAt: Date;
        size: {
            width: number;
            height: number;
            length?: number;
        };
        shapeFormat?: {
            code: string;
            name: string;
        };
        material?: {
            code: string;
            name: string;
        };
        style?: {
            code: string;
            name: string;
        };
        photos: string[];
        tags: {
            code: string;
            name: string;
        }[];
    }

    export interface Author {
        avatarUrl?: string;
        firstName: string;
        lastName: string;
        code: string;
    }

    export interface Meta {
        views: number;
        isLike: boolean;
    }
}

async function getInfo(code: string) {
    return Request.get<ProductGetInfoResponse.Response>(`/api/v1/product/${code}/info`, {responseType: 'json'});
}

export const Product = {
    getInfo
};
