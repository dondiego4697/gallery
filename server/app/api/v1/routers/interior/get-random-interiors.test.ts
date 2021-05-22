/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from '@hapi/joi';
import got from 'got';
import {range} from 'lodash';

import {TestFactory} from 'test/test-factory';
import {TestServer} from 'test/test-server';

const PATH = '/api/v1/interior/random';

const interiorSchema = Joi.object({
    code: Joi.string().required(),
    photoUrl: Joi.string().required(),
    x: Joi.number().required(),
    y: Joi.number().required(),
    maxPictureHeight: Joi.number().required(),
    maxPictureWidth: Joi.number().required()
});

describe(`GET ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;

    beforeAll(async () => {
        url = await testServer.getServerAddress();
    });

    afterAll(async () => {
        await testServer.stopServer();
    });

    it('should return random interiors', async () => {
        await Promise.all(range(20).map(() => TestFactory.createInterior()));

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false,
            searchParams: {
                limit: 2
            }
        });

        expect(statusCode).toBe(200);
        expect(body.length).toBe(2);
        expect(body.map((it: any) => interiorSchema.validate(it).error).filter(Boolean)).toEqual([]);
    });
});
