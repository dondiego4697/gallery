import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getAuthors} from 'entity/author/api/get-authors';
import {pick} from 'lodash';

interface Query {
    limit: number;
    offset: number;
    searchFirstLetter?: string;
    searchQuery?: string;
}

export const getList = wrap<Request, Response>(async (req, res) => {
    const {limit, offset, searchFirstLetter, searchQuery} = (req.query as unknown) as Query;

    const {authors, totalCount} = await getAuthors({limit, offset, searchFirstLetter, searchQuery});

    res.json({
        authors: authors.map((athr) => ({
            ...pick(athr, ['code', 'firstName', 'lastName', 'avatarUrl']),
            city: athr.city
                ? {
                      code: athr.city.code,
                      name: athr.city.name
                  }
                : null,
            country: athr.city
                ? {
                      code: athr.city.country.code,
                      name: athr.city.country.name
                  }
                : null,
            products: (athr.products || []).map((it) => ({
                code: it.code,
                photos: (it.photos || []).map((it) => it.photoUrl).sort()
            }))
        })),
        totalCount
    });
});
