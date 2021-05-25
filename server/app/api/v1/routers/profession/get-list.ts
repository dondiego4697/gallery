import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import {pick} from 'lodash';

import {getAllProfessions} from 'entity/profession/api/get-all-professions';
import {ProfessionGetListResponse} from 'types/response';

export const getList = wrap<Request, Response>(async (_req, res) => {
    const professions = await getAllProfessions();

    const data: ProfessionGetListResponse.Response = professions.map((it) => pick(it, ['code', 'name']));

    res.json(data);
});
