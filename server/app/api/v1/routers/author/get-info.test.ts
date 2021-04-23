/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {v4 as uuidv4} from 'uuid';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';

const PATH = '/api/v1/author/:id/info';

describe(`GET ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;

    beforeAll(async () => {
        url = await testServer.getServerAddress();
    });

    afterAll(async () => {
        await testServer.stopServer();
    });

    it('should return author', async () => {
        const author = await TestFactory.createAuthor();

        const {statusCode, body} = await got.get<any>(`${url}${PATH.replace(':id', author.publicId)}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            avatarUrl: author.avatarUrl,
            bio: author.bio,
            isGallery: author.isGallery,
            name: author.name,
            publicId: author.publicId,
            createdAt: author.createdAt.toISOString()
        });
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
