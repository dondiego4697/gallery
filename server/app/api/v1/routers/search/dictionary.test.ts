/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range, sortBy, last, first} from 'lodash';

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
        const categories = await Promise.all(range(0, 3).map(() => TestFactory.createCategory()));

        const filters = await Promise.all(
            range(0, 3).map(async () => ({
                style: await TestFactory.createStyle(),
                material: await TestFactory.createMaterial(),
                shapeFormat: await TestFactory.createShapeFormat()
            }))
        );

        await pMap(
            categories,
            async (category) => {
                return Promise.all(
                    filters.map((filter) =>
                        TestFactory.createProduct({
                            categoryId: category.id,
                            authorId: author.id,
                            product: {
                                styleId: filter.style.id,
                                materialId: filter.material.id,
                                shapeFormatId: filter.shapeFormat.id
                            }
                        })
                    )
                );
            },
            {concurrency: 1}
        );

        const products = await TestFactory.getProducts();

        const width = sortBy(products, 'size.width');
        const height = sortBy(products, 'size.height');
        const length = sortBy(products, 'size.length').filter((it) => it.size.length);
        const price = sortBy(products, 'price');

        const color = await TestFactory.createColor();

        await Promise.all(
            products.map((product) =>
                TestFactory.createProductColor({
                    productId: product.id,
                    colorId: color.id
                })
            )
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            minMax: {
                minHeight: first(height)?.size.height,
                maxHeight: last(height)?.size.height,
                minLength: first(length)?.size.length,
                maxLength: last(length)?.size.length,
                minWidth: first(width)?.size.width,
                maxWidth: last(width)?.size.width,
                minPrice: first(price)?.price,
                maxPrice: last(price)?.price
            },
            filters: categories.reduce(
                (acc, category) => ({
                    ...acc,
                    [category.code]: {
                        material: sortBy(
                            filters.map((it) => ({name: it.material.name, code: it.material.code})),
                            'code'
                        ),
                        shapeFormat: sortBy(
                            filters.map((it) => ({name: it.shapeFormat.name, code: it.shapeFormat.code})),
                            'code'
                        ),
                        style: sortBy(
                            filters.map((it) => ({name: it.style.name, code: it.style.code})),
                            'code'
                        ),
                        color: [
                            {
                                code: color.code,
                                name: color.name
                            }
                        ]
                    }
                }),
                {}
            )
        });
    });
});
