/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range, random} from 'lodash';
import {v4 as uuidv4} from 'uuid';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';
import {JWT} from 'app/lib/jwt';
import {User} from 'entity/user';
import {config} from 'app/config';

const PATH = '/api/v1/picture/:id/info';

describe(`GET ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;
    let user: User;
    let headers: Record<string, string> = {};

    beforeAll(async () => {
        url = await testServer.getServerAddress();
        user = await TestFactory.createUser();
        headers = {
            Cookie: `${config['cookie.key.userToken']}=${JWT.encode({id: user.id})}`
        };
    });

    afterAll(async () => {
        await testServer.stopServer();
    });

    it('should return picture', async () => {
        const author = await TestFactory.createAuthor();
        const picShape = await TestFactory.createPictureShape();
        const picStyle = await TestFactory.createPictureStyle();
        const picture = await TestFactory.createPicture({
            authorId: author.id,
            shapeId: picShape.id,
            styleId: picStyle.id
        });

        const viewsCount = random(5, 12);

        await Promise.all(range(0, viewsCount).map(() => TestFactory.createPictureView(picture.id)));
        const photos = await Promise.all(range(0, 3).map(() => TestFactory.createPicturePhoto(picture.id)));

        const isLike = Math.random() > 0.5 ? true : false;

        if (isLike) {
            await TestFactory.createPictureLike(picture.id, user.id);
        }

        const {statusCode, body} = await got.get<any>(`${url}${PATH.replace(':id', picture.publicId)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            publicId: picture.publicId,
            name: picture.name,
            width: picture.width,
            height: picture.height,
            isSold: picture.isSold,
            createdAt: picture.createdAt.toISOString(),
            shape: {
                code: picShape.code,
                name: picShape.name
            },
            style: {
                code: picStyle.code,
                name: picStyle.name
            },
            author: {
                avatarUrl: author.avatarUrl,
                bio: author.bio,
                isGallery: author.isGallery,
                name: author.name,
                publicId: author.publicId,
                createdAt: author.createdAt.toISOString()
            },
            views: viewsCount,
            isLike,
            photos: expect.anything()
        });
        expect(body.photos.sort()).toEqual(photos.map((it) => it.photoUrl).sort());
    });

    it('should throw 404', async () => {
        const {statusCode, body} = await got.get(`${url}${PATH.replace(':id', uuidv4())}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(404);
        expect(body).toMatchObject({
            message: 'ENTITY_NOT_FOUND'
        });
    });
});
