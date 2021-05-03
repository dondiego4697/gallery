/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {v4 as uuidv4} from 'uuid';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';
import pMap from 'p-map';
import {range} from 'lodash';
import {User} from 'entity/user';
import {config} from 'app/config';
import {JWT} from 'app/lib/jwt';

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

    it('should return poor author', async () => {
        const country = await TestFactory.createCountry();
        const city = await TestFactory.createCity({countryId: country.id});
        const author = await TestFactory.createAuthor({cityId: city.id});

        const {statusCode, body} = await got.get<any>(`${url}${PATH.replace(':code', author.code)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers,
            searchParams: {
                poor: true
            }
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            avatarUrl: author.avatarUrl,
            bio: author.bio,
            firstName: author.firstName,
            lastName: author.lastName,
            code: author.code,
            createdAt: author.createdAt.toISOString(),
            city: {
                code: city.code,
                name: city.name,
                country: {
                    code: country.code,
                    name: country.name
                }
            },
            products: [],
            professions: []
        });
    });

    it('should return full author', async () => {
        const country = await TestFactory.createCountry();
        const city = await TestFactory.createCity({countryId: country.id});
        const author = await TestFactory.createAuthor({cityId: city.id});
        const profession = await TestFactory.createProfession();

        await TestFactory.createAuthorProfession({
            authorId: author.id,
            professionId: profession.id
        });
        const otherAuthor = await TestFactory.createAuthor();

        const products = await pMap(
            range(0, 10),
            async (i) => {
                const productCategory = await TestFactory.createProductCategory();
                const product = await TestFactory.createProduct({
                    productCategoryId: productCategory.id,
                    authorId: author.id
                });

                await Promise.all(range(0, i + 1).map(() => TestFactory.createProductView({productId: product.id})));
                const photos = await Promise.all(
                    range(0, 5).map(() => TestFactory.createProductPhoto({productId: product.id}))
                );

                const isLike = Math.random() > 0.5 ? true : false;

                if (isLike) {
                    await TestFactory.createProductLike({
                        productId: product.id,
                        userId: user.id
                    });
                }

                return {productCategory, product, photos, isLike};
            },
            {concurrency: 4}
        );

        await pMap(
            range(0, 10),
            async () => {
                const category = await TestFactory.createProductCategory();

                return TestFactory.createProduct({
                    productCategoryId: category.id,
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

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            avatarUrl: author.avatarUrl,
            bio: author.bio,
            firstName: author.firstName,
            lastName: author.lastName,
            code: author.code,
            createdAt: author.createdAt.toISOString(),
            city: {
                code: city.code,
                name: city.name,
                country: {
                    code: country.code,
                    name: country.name
                }
            },
            professions: [
                {
                    code: profession.code,
                    name: profession.name
                }
            ],
            products: products.reverse().map(({product, isLike, productCategory}, i) => ({
                code: product.code,
                createdAt: product.createdAt.toISOString(),
                data: {},
                isLike,
                isSold: product.isSold,
                material: product.material,
                name: product.name,
                photos: expect.anything(),
                price: product.price,
                shapeFormat: product.shapeFormat,
                productCategory: {
                    code: productCategory.code,
                    name: productCategory.name
                },
                size: product.size,
                style: product.style,
                views: products.length - i
            }))
        });
        expect(body.products.map((it: any) => it.photos.sort())).toEqual(
            products.map(({photos}) => photos.map((it) => it.photoUrl).sort())
        );
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
