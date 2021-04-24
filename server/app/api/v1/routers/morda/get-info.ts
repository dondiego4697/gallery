import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getAllSelections} from 'entity/selection/api/get-all-selections';

export const getInfo = wrap<Request, Response>(async (_req, res) => {
    const selections = await getAllSelections();

    res.json({selections});
});
