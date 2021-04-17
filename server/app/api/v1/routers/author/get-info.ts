import {omit} from 'lodash';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getAuthorByPublicId} from 'entity/author/api/get-author-by-public-id';
import {ClientError} from 'service/error';

export const getInfo = wrap<Request, Response>(async (req, res) => {
    const {id} = req.params;
    const author = await getAuthorByPublicId(id);

    if (!author) {
        throw new ClientError('ENTITY_NOT_FOUND', {request: req, group: 'application'});
    }

    res.json(omit(author, 'id'));
});
