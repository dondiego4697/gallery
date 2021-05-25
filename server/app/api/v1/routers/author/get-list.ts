import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {pick} from 'lodash';

import {getAuthors} from 'entity/author/api/get-authors';
import {AuthorGetListResponse} from 'types/response';

interface Query {
    limit: number;
    offset: number;
    professionCode?: string;
    searchFirstLetter?: string;
    searchQuery?: string;
}

export const getList = wrap<Request, Response>(async (req, res) => {
    const {limit, offset, professionCode, searchFirstLetter, searchQuery} = (req.query as unknown) as Query;

    const {authors, totalCount} = await getAuthors({limit, offset, searchFirstLetter, searchQuery, professionCode});

    const data: AuthorGetListResponse.Response = {
        authors: authors.map((athr) => ({
            ...pick(athr, ['code', 'firstName', 'lastName', 'avatarUrl']),
            city: athr.city
                ? {
                      code: athr.city.code,
                      name: athr.city.name
                  }
                : undefined,
            country: athr.city
                ? {
                      code: athr.city.country.code,
                      name: athr.city.country.name
                  }
                : undefined,
            products: (athr.products || []).map((it) => ({
                code: it.code,
                photo: (it.photos || []).find((it) => it.isDefault)?.photoUrl
            })),
            professions: (athr.professions || []).map((it) => it.name)
        })),
        totalCount
    };

    res.json(data);
});
