/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {v4 as uuidv4} from 'uuid';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';
import {config} from 'app/config';
import {JWT} from 'app/lib/jwt';
import {User} from 'entity/user';

const PATH = '/api/v1/picture/:id/like';

describe(`PUT ${PATH}`, () => {
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

    it('should toggle like', async () => {
        const author = await TestFactory.createAuthor();
        const picture = await TestFactory.createPicture({authorId: author.id});

        const responseForLike = await got.put<any>(`${url}${PATH.replace(':id', picture.publicId)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(responseForLike.statusCode).toBe(200);
        expect(responseForLike.body).toEqual({result: 'inserted'});

        const likes1 = await TestFactory.getPicturesLikes();

        expect(likes1.find((it) => it.pictureId === picture.id && it.userId === user.id)).not.toBeFalsy();

        const responseForUnlike = await got.put<any>(`${url}${PATH.replace(':id', picture.publicId)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(responseForUnlike.statusCode).toBe(200);
        expect(responseForUnlike.body).toEqual({result: 'deleted'});

        const likes2 = await TestFactory.getPicturesLikes();

        expect(likes2.find((it) => it.pictureId === picture.id && it.userId === user.id)).toBeFalsy();
    });

    it('should throw 404 if picture does not exist', async () => {
        const {statusCode, body} = await got.put<any>(`${url}${PATH.replace(':id', uuidv4())}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(statusCode).toBe(404);
        expect(body).toMatchObject({
            message: 'ENTITY_NOT_FOUND'
        });
    });

    it('should throw 401 if user unauthorized', async () => {
        const {statusCode, body} = await got.put<any>(`${url}${PATH.replace(':id', uuidv4())}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(401);
        expect(body).toMatchObject({
            message: 'UNAUTHORIZED'
        });
    });
});
