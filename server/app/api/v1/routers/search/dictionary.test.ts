/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range} from 'lodash';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';
import pMap from 'p-map';

const PATH = '/api/v1/search/dictionary';

describe(`GET ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;

    beforeAll(async () => {
        url = await testServer.getServerAddress();
    });

    afterAll(async () => {
        await testServer.stopServer();
    });

    it('should return dictionary for search', async () => {
        const author = await TestFactory.createAuthor();
        const productCategories = await Promise.all(range(0, 3).map(() => TestFactory.createProductCategory()));

        await pMap(
            productCategories,
            async (productCategory) => {
                return Promise.all(
                    range(0, 3).map((i) =>
                        TestFactory.createProduct({
                            productCategoryId: productCategory.id,
                            authorId: author.id,
                            product: {
                                style: 'style' + i,
                                shapeFormat: 'shapeFormat' + i,
                                material: 'material' + i
                            }
                        })
                    )
                );
            },
            {concurrency: 1}
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual(
            productCategories.reduce(
                (acc, category) => ({
                    ...acc,
                    [category.code]: {
                        material: range(0, 3).map((i) => `material${i}`),
                        shapeFormat: range(0, 3).map((i) => `shapeFormat${i}`),
                        style: range(0, 3).map((i) => `style${i}`)
                    }
                }),
                {}
            )
        );
    });
});
