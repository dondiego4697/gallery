import {Request, Response} from 'express';
import {omit} from 'lodash';
import {wrap} from 'async-middleware';
import {getAuthorByPublicId, getAuthorPictures} from 'entity/author/api/get-author-by-public-id';
import {ClientError} from 'service/error';
import {getViewsCount} from 'entity/view-of-picture-view/api/get-views-count';
import {getPictureLikesForUser} from 'entity/picture-like/api/get-picture-likes-for-user';

interface Query {
    limit: number;
    offset: number;
}

export const getPictures = wrap<Request, Response>(async (req, res) => {
    const {limit, offset} = (req.query as unknown) as Query;
    const {id} = req.params;

    const author = await getAuthorByPublicId(id);

    if (!author) {
        throw new ClientError('ENTITY_NOT_FOUND', {request: req, group: 'application'});
    }

    const pictures = await getAuthorPictures({authorId: author.id, limit, offset});

    const user = await req.context.getUser();
    const pictureIds = pictures.map((it) => it.id);

    const [views, likes] = await Promise.all([
        getViewsCount(pictureIds),
        user ? getPictureLikesForUser({userId: user.id, pictureIds}) : Promise.resolve(new Set<number>())
    ]);

    const data = pictures.map((pictureRaw) => {
        const picture = omit(pictureRaw, ['id', 'shapeId', 'styleId', 'authorId', 'shape.id', 'style.id']);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (picture as any).views = views[pictureRaw.id]?.count || 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (picture as any).photos = pictureRaw.photos.map((it: any) => it.photoUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (picture as any).isLike = likes.has(pictureRaw.id);

        return picture;
    });

    res.json(data);
});
