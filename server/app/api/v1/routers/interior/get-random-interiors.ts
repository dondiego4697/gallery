import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {pick} from 'lodash';

import {getRandomInteriors as getRandomInteriorsFromDb} from 'entity/interior/api/get-random-interiors';
import {InteriorRandomResponse} from 'types/response';

interface Query {
    limit: number;
}

export const getRandomInteriors = wrap<Request, Response>(async (req, res) => {
    const {limit} = (req.query as unknown) as Query;

    const interiors = await getRandomInteriorsFromDb(limit);

    const data: InteriorRandomResponse.Response = interiors.map((it) =>
        pick(it, ['code', 'photoUrl', 'x', 'y', 'maxPictureHeight', 'maxPictureWidth'])
    );

    res.json(data);
});
