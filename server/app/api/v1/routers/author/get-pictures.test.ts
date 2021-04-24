/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import pMap from 'p-map';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';
import {JWT} from 'app/lib/jwt';
import {User} from 'entity/user';
import {config} from 'app/config';

const PATH = '/api/v1/author/:id/pictures';

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

    it("should return author's pictures", async () => {
        const author = await TestFactory.createAuthor();
        const otherAuthor = await TestFactory.createAuthor();

        const pictures = await pMap(
            range(0, 10),
            async () => {
                const picture = await TestFactory.createPicture({authorId: author.id});

                await Promise.all(range(0, 2).map(() => TestFactory.createPictureView(picture.id)));
                const photos = await Promise.all(range(0, 5).map(() => TestFactory.createPicturePhoto(picture.id)));

                const isLike = Math.random() > 0.5 ? true : false;

                if (isLike) {
                    await TestFactory.createPictureLike(picture.id, user.id);
                }

                return {picture, photos, isLike};
            },
            {concurrency: 4}
        );

        await pMap(
            range(0, 10),
            async () => {
                return TestFactory.createPicture({authorId: otherAuthor.id});
            },
            {concurrency: 4}
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH.replace(':id', author.publicId)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        const shapesHash = await TestFactory.getPictureShapesHash();
        const stylesHash = await TestFactory.getPictureStylesHash();

        expect(statusCode).toBe(200);
        expect(body).toEqual(
            pictures.map(({picture, isLike}) => {
                const shape = shapesHash[picture.shapeId];
                const style = stylesHash[picture.styleId];

                return {
                    height: picture.height,
                    width: picture.width,
                    isSold: picture.isSold,
                    name: picture.name,
                    publicId: picture.publicId,
                    shape: {
                        code: shape.code,
                        name: shape.name
                    },
                    style: {
                        code: style.code,
                        name: style.name
                    },
                    views: 2,
                    isLike,
                    photos: expect.anything(),
                    createdAt: picture.createdAt.toISOString()
                };
            })
        );

        expect(body.map((pic: any) => pic.photos.sort())).toEqual(
            pictures.map(({photos}) => photos.map((it) => it.photoUrl).sort())
        );
    });

    it("should return author's pictures with offset and limit", async () => {
        const author = await TestFactory.createAuthor();

        const pictures = await pMap(
            range(0, 10),
            async () => {
                return TestFactory.createPicture({authorId: author.id});
            },
            {concurrency: 1}
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH.replace(':id', author.publicId)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            searchParams: {
                limit: 3,
                offset: 2
            }
        });

        const shapesHash = await TestFactory.getPictureShapesHash();
        const stylesHash = await TestFactory.getPictureStylesHash();

        expect(statusCode).toBe(200);
        expect(body).toEqual(
            pictures.slice(2, 5).map((raw) => {
                const shape = shapesHash[raw.shapeId];
                const style = stylesHash[raw.styleId];

                return {
                    height: raw.height,
                    width: raw.width,
                    isSold: raw.isSold,
                    name: raw.name,
                    publicId: raw.publicId,
                    shape: {
                        code: shape.code,
                        name: shape.name
                    },
                    style: {
                        code: style.code,
                        name: style.name
                    },
                    views: 0,
                    photos: [],
                    isLike: false,
                    createdAt: raw.createdAt.toISOString()
                };
            })
        );
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
