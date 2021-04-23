import {Request, Response} from 'express';
import {omit} from 'lodash';
import {wrap} from 'async-middleware';
import {getAuthorByPublicIdWithPictures} from 'entity/author/api/get-author-by-public-id';
import {ClientError} from 'service/error';

interface Query {
    limit: number;
    offset: number;
}

export const getPictures = wrap<Request, Response>(async (req, res) => {
    const {limit, offset} = (req.query as unknown) as Query;
    const {id} = req.params;

    const author = await getAuthorByPublicIdWithPictures({id, limit, offset});

    if (!author) {
        throw new ClientError('ENTITY_NOT_FOUND', {request: req, group: 'application'});
    }

    const data = author.pictures.map((pictureRaw) => {
        const picture = omit(pictureRaw, ['id', 'shapeId', 'styleId', 'authorId']);

        return {
            ...picture,
            shape: omit(picture.shape, 'id'),
            style: omit(picture.style, 'id')
        };
    });

    res.json(data);
});
