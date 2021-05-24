/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range, reverse} from 'lodash';
import pMap from 'p-map';
import {v4 as uuidv4} from 'uuid';

import {config} from 'app/config';
import {JWT} from 'app/lib/jwt';
import {User} from 'entity/user';
import {TestFactory} from 'test/test-factory';
import {TestServer} from 'test/test-server';

const PATH = '/api/v1/author/:code/info';

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

    it('should return author', async () => {
        const country = await TestFactory.createCountry();
        const city = await TestFactory.createCity({countryId: country.id});
        const author = await TestFactory.createAuthor({cityId: city.id});
        const otherAuthor = await TestFactory.createAuthor();
        const profession = await TestFactory.createProfession();

        await TestFactory.createAuthorProfession({
            authorId: author.id,
            professionId: profession.id
        });

        const categories = await Promise.all([TestFactory.createCategory(), TestFactory.createCategory()]);

        const products = await pMap(
            range(0, 10),
            async (i) => {
                const category = categories[i % categories.length];
                const product = await TestFactory.createProduct({
                    categoryId: category.id,
                    authorId: author.id
                });

                await Promise.all(range(0, i + 1).map(() => TestFactory.createProductView({productId: product.id})));
                const photos = await Promise.all([
                    TestFactory.createProductPhoto({productId: product.id}),
                    TestFactory.createProductPhoto({productId: product.id}),
                    TestFactory.createProductPhoto({productId: product.id, isDefault: true})
                ]);

                const isLike = Math.random() > 0.5 ? true : false;

                if (isLike) {
                    await TestFactory.createProductLike({
                        productId: product.id,
                        userId: user.id
                    });
                }

                return {
                    product,
                    photos: photos.map((it) => it.photoUrl),
                    isLike
                };
            },
            {concurrency: 4}
        );

        // Добавляем шум
        await pMap(
            range(0, 10),
            async () => {
                const category = await TestFactory.createCategory();

                return TestFactory.createProduct({
                    categoryId: category.id,
                    authorId: otherAuthor.id
                });
            },
            {concurrency: 4}
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH.replace(':code', author.code)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        reverse(products);

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            author: {
                firstName: author.firstName,
                lastName: author.lastName,
                code: author.code,
                avatarUrl: author.avatarUrl,
                bio: author.bio,
                createdAt: author.createdAt.toISOString(),
                city: {
                    code: city.code,
                    name: city.name
                },
                country: {
                    code: country.code,
                    name: country.name
                },
                professions: [profession.name]
            },
            products: products.map(({product, photos, isLike}, i) => ({
                code: product.code,
                name: product.name,
                price: product.price,
                size: product.size,
                isSold: product.isSold,
                meta: {
                    isLike,
                    views: products.length - i
                },
                photo: photos[2],
                releaseYear: product.releaseYear
            }))
        });
    });

    it('should throw 404', async () => {
        const {statusCode, body} = await got.get(`${url}${PATH.replace(':code', uuidv4())}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(404);
        expect(body).toMatchObject({
            message: 'ENTITY_NOT_FOUND'
        });
    });
});
