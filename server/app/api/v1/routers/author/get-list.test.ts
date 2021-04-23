/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range} from 'lodash';
import pMap from 'p-map';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';

const PATH = '/api/v1/author';

describe(`GET ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;

    beforeAll(async () => {
        url = await testServer.getServerAddress();
    });

    afterAll(async () => {
        await testServer.stopServer();
    });

    it('should return authors', async () => {
        const authors = await pMap(
            range(0, 4),
            async () => {
                return TestFactory.createAuthor();
            },
            {concurrency: 1}
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false,
            searchParams: {
                limit: 2,
                offset: 1
            }
        });

        expect(statusCode).toBe(200);
        expect(body.authors.length).toBe(2);
        expect(body).toEqual({
            totalCount: 4,
            authors: authors.slice(1, 3).map((it) => ({
                publicId: it.publicId,
                avatarUrl: it.avatarUrl,
                name: it.name,
                bio: it.bio,
                isGallery: it.isGallery,
                createdAt: it.createdAt.toISOString()
            }))
        });
    });
});
