import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {pick} from 'lodash';

import {getAuthors} from 'entity/author/api/get-authors';

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
                photo: (it.photos || []).find((it) => it.isDefault)?.photoUrl
            }))
        })),
        totalCount
    });
});
