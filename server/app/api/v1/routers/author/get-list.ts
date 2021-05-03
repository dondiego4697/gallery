import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getAuthors} from 'entity/author/api/get-authors';
import {omit} from 'lodash';

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
        authors: authors.map((it) => omit(it, ['id', 'cityId', 'city.id', 'city.countryId', 'city.country.id'])),
        totalCount
    });
});
