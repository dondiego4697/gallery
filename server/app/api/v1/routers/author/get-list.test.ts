/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import casual from 'casual';
import {range, sortBy, random} from 'lodash';
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
        const country = await TestFactory.createCountry();
        const city = await TestFactory.createCity({countryId: country.id});
        const productCategory = await TestFactory.createProductCategory();

        const authors = await pMap(
            range(0, 4),
            async () => {
                const author = await TestFactory.createAuthor({cityId: city.id});

                const products = await Promise.all(
                    range(0, random(2, 5)).map(() =>
                        TestFactory.createProduct({
                            authorId: author.id,
                            productCategoryId: productCategory.id
                        })
                    )
                );

                // Создаем по одной фотографии на продукт
                const photos = await Promise.all(
                    products.map((it) =>
                        TestFactory.createProductPhoto({
                            productId: it.id
                        })
                    )
                );

                return {author, photos};
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
                bio: author.bio,
                city: {
                    code: city.code,
                    name: city.name,
                    country: {
                        code: country.code,
                        name: country.name
                    }
                },
                createdAt: author.createdAt.toISOString(),
                productsPhotos: expect.anything()
            }))
        );

        expect(body.authors.map((athr: any) => athr.productsPhotos.sort())).toEqual(
            expectedAuthors.map(({photos}) => photos.map((it) => it.photoUrl).sort())
        );
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

        expect(body.authors).toEqual(
            sortBy(authors, (it) => it.firstName.toLowerCase())
                .slice(2, 7)
                .map((it) => ({
                    code: it.code,
                    avatarUrl: it.avatarUrl,
                    firstName: it.firstName,
                    lastName: it.lastName,
                    bio: it.bio,
                    city: null,
                    createdAt: it.createdAt.toISOString(),
                    productsPhotos: []
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

        expect(body.authors).toEqual(
            sortBy(authors, (it) => it.firstName.toLowerCase())
                .slice(2, 7)
                .map((it) => ({
                    code: it.code,
                    avatarUrl: it.avatarUrl,
                    firstName: it.firstName,
                    lastName: it.lastName,
                    bio: it.bio,
                    city: null,
                    createdAt: it.createdAt.toISOString(),
                    productsPhotos: []
                }))
        );
    });
});
