/* eslint-disable @typescript-eslint/no-namespace */
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
        avatarUrl?: string;
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
        photo: string;
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
        avatarUrl?: string;
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

export namespace ProductGetInfoResponse {
    export interface Response {
        author: Author;
        product: Product;
        meta: Meta;
    }

    export interface Product {
        code: string;
        name: string;
        description?: string;
        price: number;
        releaseYear?: number;
        defaultPhoto?: string;
        isSold: boolean;
        createdAt: Date;
        size: {
            width: number;
            height: number;
            length?: number;
        };
        category: {
            code: string;
            name: string;
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
        interiors: {
            code: string;
            photoUrl: string;
            x: number;
            y: number;
            maxPictureHeight: number;
            maxPictureWidth: number;
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

export namespace InteriorRandomResponse {
    export type Response = Interior[];

    export interface Interior {
        code: string;
        photoUrl: string;
        x: number;
        y: number;
        maxPictureHeight: number;
        maxPictureWidth: number;
    }
}

export namespace AuthorGetListResponse {
    export interface Response {
        authors: Author[];
        totalCount: number;
    }

    export interface Author {
        code: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
        city?: {
            code?: string;
            name?: string;
        };
        country?: {
            code?: string;
            name?: string;
        };
        products: {
            code: string;
            photo?: string;
        }[];
        professions: string[];
    }
}

export namespace ProfessionGetListResponse {
    export type Response = Profession[];

    export interface Profession {
        code: string;
        name: string;
    }
}
