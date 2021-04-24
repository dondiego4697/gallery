import {omit} from 'lodash';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import {getPictureByPublicId} from 'entity/picture/api/get-picture-by-public-id';
import {ClientError} from 'service/error';
import {getViewsCount} from 'entity/view-of-picture-view/api/get-views-count';
import {getPictureLikesForUser} from 'entity/picture-like/api/get-picture-likes-for-user';

export const getInfo = wrap<Request, Response>(async (req, res) => {
    const {id} = req.params;
    const picture = await getPictureByPublicId(id);

    if (!picture) {
        throw new ClientError('ENTITY_NOT_FOUND', {request: req, group: 'application'});
    }

    const user = await req.context.getUser();

    const [views, likes] = await Promise.all([
        getViewsCount([picture.id]),
        user ? getPictureLikesForUser({userId: user.id, pictureIds: [picture.id]}) : Promise.resolve(new Set<number>())
    ]);

    res.json({
        ...omit(picture, ['id', 'shapeId', 'styleId', 'authorId', 'author.id', 'shape.id', 'style.id']),
        views: views[picture.id]?.count || 0,
        photos: picture.photos.map((it) => it.photoUrl),
        isLike: likes.has(picture.id)
    });
});
