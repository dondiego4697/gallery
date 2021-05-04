/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range, random, xor, xorBy} from 'lodash';
import {v4 as uuidv4} from 'uuid';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';
import {JWT} from 'app/lib/jwt';
import {User} from 'entity/user';
import {config} from 'app/config';

const PATH = '/api/v1/product/:code/info';

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

    it('should return product', async () => {
        const country = await TestFactory.createCountry();
        const city = await TestFactory.createCity({countryId: country.id});
        const author = await TestFactory.createAuthor({cityId: city.id});
        const profession = await TestFactory.createProfession();

        await TestFactory.createAuthorProfession({
            authorId: author.id,
            professionId: profession.id
        });

        const productCategory = await TestFactory.createProductCategory();
        const product = await TestFactory.createProduct({
            authorId: author.id,
            productCategoryId: productCategory.id
        });

        const tags = await Promise.all(range(0, 5).map(() => TestFactory.createTag()));

        await Promise.all(
            tags.map((tag) =>
                TestFactory.createProductTag({
                    productId: product.id,
                    tagId: tag.id
                })
            )
        );

        const viewsCount = random(5, 12);

        await Promise.all(range(0, viewsCount).map(() => TestFactory.createProductView({productId: product.id})));
        const photos = await Promise.all(
            range(0, 3).map(() => TestFactory.createProductPhoto({productId: product.id}))
        );

        const isLike = Math.random() > 0.5 ? true : false;

        if (isLike) {
            await TestFactory.createProductLike({
                productId: product.id,
                userId: user.id
            });
        }

        const {statusCode, body} = await got.get<any>(`${url}${PATH.replace(':code', product.code)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            meta: {
                views: viewsCount,
                isLike
            },
            author: {
                firstName: author.firstName,
                lastName: author.lastName,
                code: author.code,
                avatarUrl: author.avatarUrl
            },
            product: {
                code: product.code,
                name: product.name,
                size: product.size,
                data: product.data,
                price: product.price,
                isSold: product.isSold,
                createdAt: product.createdAt.toISOString(),
                style: product.style,
                shapeFormat: product.shapeFormat,
                material: product.material,
                photos: expect.anything(),
                tags: expect.anything()
            }
        });

        expect(xorBy(body.product.tags, tags, 'code').length).toBe(0);
        expect(
            xor(
                body.product.photos,
                photos.map((it) => it.photoUrl)
            ).length
        ).toBe(0);
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
