/* eslint-disable @typescript-eslint/no-explicit-any */
import casual from 'casual';
import got from 'got';
import {range, sortBy, xor, xorBy} from 'lodash';
import pMap from 'p-map';

import {TestFactory} from 'test/test-factory';
import {TestServer} from 'test/test-server';

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
        const country = await TestFactory.createCountry();
        const city = await TestFactory.createCity({countryId: country.id});
        const category = await TestFactory.createCategory();

        const authors = await pMap(
            range(0, 4),
            async () => {
                const author = await TestFactory.createAuthor({cityId: city.id});

                const products = await Promise.all([
                    TestFactory.createProduct({
                        authorId: author.id,
                        categoryId: category.id
                    }),
                    TestFactory.createProduct({
                        authorId: author.id,
                        categoryId: category.id
                    })
                ]);

                const photos = await pMap(products, async (product) => {
                    const photosRaw = await Promise.all([
                        TestFactory.createProductPhoto({productId: product.id}),
                        TestFactory.createProductPhoto({productId: product.id}),
                        TestFactory.createProductPhoto({productId: product.id, isDefault: true})
                    ]);

                    return photosRaw.map((it) => it.photoUrl);
                });

                return {author, products, photos};
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

        const expectedAuthors = sortBy(authors, ({author}) => author.firstName.toLowerCase()).slice(1, 3);

        expect(statusCode).toBe(200);
        expect(body.totalCount).toBe(4);
        expect(body.authors).toEqual(
            expectedAuthors.map(({author}) => ({
                code: author.code,
                avatarUrl: author.avatarUrl,
                firstName: author.firstName,
                lastName: author.lastName,
                city: {
                    code: city.code,
                    name: city.name
                },
                country: {
                    code: country.code,
                    name: country.name
                },
                products: expect.anything()
            }))
        );

        const productsDiff = expectedAuthors.map(
            ({products}, i) => xorBy(products, body.authors[i].products, 'code').length
        );

        expect(productsDiff).toStrictEqual([0, 0]);

        const productsPhotosDiff = expectedAuthors.map(({photos}, i) => {
            return xor(
                photos.map((it) => it[2]),
                body.authors[i].products.map((it: any) => it.photo)
            ).length;
        });

        expect(productsPhotosDiff).toStrictEqual([0, 0]);
    });

    it('should search by query', async () => {
        const searchQuery = 'nNaSjBq';
        const authorsA = await pMap(
            range(0, 4),
            async () =>
                TestFactory.createAuthor({
                    author: {
                        firstName: `${casual.word}${searchQuery.toLowerCase()}${casual.word}`
                    }
                }),
            {concurrency: 1}
        );
        const authorsB = await pMap(
            range(0, 4),
            async () =>
                TestFactory.createAuthor({
                    author: {
                        lastName: `${casual.word}${searchQuery.toLowerCase()}${casual.word}`
                    }
                }),
            {concurrency: 1}
        );

        await pMap(range(0, 10), async () => TestFactory.createAuthor(), {concurrency: 1});

        const authors = [...authorsA, ...authorsB];

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false,
            searchParams: {
                limit: 5,
                offset: 2,
                searchQuery
            }
        });

        expect(statusCode).toBe(200);
        expect(body.totalCount).toBe(8);

        const expectedAuthors = sortBy(authors, (it) => it.firstName.toLowerCase()).slice(2, 7);

        expect(body.authors).toEqual(
            expectedAuthors.map((it) => ({
                code: it.code,
                avatarUrl: it.avatarUrl,
                firstName: it.firstName,
                lastName: it.lastName,
                city: null,
                country: null,
                products: []
            }))
        );
    });

    it('should search by first letter', async () => {
        const searchFirstLetter = 'N';
        const authors = await pMap(
            range(0, 4),
            async () =>
                TestFactory.createAuthor({
                    author: {
                        lastName: `${searchFirstLetter.toLowerCase()}${casual.word}`
                    }
                }),
            {concurrency: 1}
        );

        await pMap(
            range(0, 10),
            async () =>
                TestFactory.createAuthor({
                    author: {
                        firstName: `${searchFirstLetter}${casual.word}`,
                        lastName: casual.word.replace(searchFirstLetter.toLowerCase(), '')
                    }
                }),
            {concurrency: 1}
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false,
            searchParams: {
                limit: 5,
                offset: 2,
                searchFirstLetter
            }
        });

        expect(statusCode).toBe(200);
        expect(body.totalCount).toBe(4);

        const expectedAuthors = sortBy(authors, (it) => it.firstName.toLowerCase()).slice(2, 7);

        expect(body.authors).toEqual(
            expectedAuthors.map((it) => ({
                code: it.code,
                avatarUrl: it.avatarUrl,
                firstName: it.firstName,
                lastName: it.lastName,
                city: null,
                country: null,
                products: []
            }))
        );
    });
});
