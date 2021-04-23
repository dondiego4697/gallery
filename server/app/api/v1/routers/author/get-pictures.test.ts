/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range} from 'lodash';
import {v4 as uuidv4} from 'uuid';
import pMap from 'p-map';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';

const PATH = '/api/v1/author/:id/pictures';

describe(`GET ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;

    beforeAll(async () => {
        url = await testServer.getServerAddress();
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
                return TestFactory.createPicture({authorId: author.id});
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
            throwHttpErrors: false
        });

        const shapesHash = await TestFactory.getPictureShapesHash();
        const stylesHash = await TestFactory.getPictureStylesHash();

        expect(statusCode).toBe(200);
        expect(body).toEqual(
            pictures.map((raw) => {
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
                    createdAt: raw.createdAt.toISOString()
                };
            })
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
