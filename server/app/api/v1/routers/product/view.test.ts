/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';
import {range, sortBy} from 'lodash';
import pMap from 'p-map';
import {v4 as uuidv4} from 'uuid';

import {config} from 'app/config';
import {JWT} from 'app/lib/jwt';
import {User} from 'entity/user';
import {TestFactory} from 'test/test-factory';
import {TestServer} from 'test/test-server';

const PATH = '/api/v1/product/:code/view';

describe(`PUT ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;
    let user: User;
    let headers: Record<string, string> = {};
    const fingerprint = uuidv4();

    beforeAll(async () => {
        url = await testServer.getServerAddress();
        user = await TestFactory.createUser();
        headers = {
            Cookie: [
                `${config['cookie.key.userToken']}=${JWT.encode({id: user.id})}`,
                `${config['cookie.key.fingerprint']}=${fingerprint}`
            ].join('; ')
        };
    });

    afterAll(async () => {
        await testServer.stopServer();
    });

    it('should add view once', async () => {
        const author = await TestFactory.createAuthor();
        const category = await TestFactory.createCategory();
        const product = await TestFactory.createProduct({authorId: author.id, categoryId: category.id});

        const responseForView1 = await got.put<any>(`${url}${PATH.replace(':code', product.code)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(responseForView1.statusCode).toBe(200);
        expect(responseForView1.body).toEqual({});

        const viewsRaw1 = await TestFactory.getProductsViews();
        const views1 = viewsRaw1.filter((it) => it.productId === product.id && it.fingerprint === fingerprint);

        expect(views1.length).toBe(1);

        const responseForView2 = await got.put<any>(`${url}${PATH.replace(':code', product.code)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(responseForView2.statusCode).toBe(200);
        expect(responseForView2.body).toEqual({});

        const viewsRaw2 = await TestFactory.getProductsViews();
        const views2 = viewsRaw2.filter((it) => it.productId === product.id && it.fingerprint === fingerprint);

        expect(views2.length).toBe(1);
    });

    it('should not add view if fingerprint does not exists', async () => {
        const author = await TestFactory.createAuthor();
        const category = await TestFactory.createCategory();
        const product = await TestFactory.createProduct({authorId: author.id, categoryId: category.id});

        const viewsRawBefore = await TestFactory.getProductsViews();
        const viewsBefore = viewsRawBefore.filter((it) => it.productId === product.id);

        expect(viewsBefore.length).toBe(0);

        const {statusCode, body} = await got.put<any>(`${url}${PATH.replace(':code', product.code)}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers: {
                Cookie: headers.Cookie.replace(config['cookie.key.fingerprint'], 'some_other_cookie')
            }
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual({});

        const viewsRawAfter = await TestFactory.getProductsViews();
        const viewsAfter = viewsRawAfter.filter((it) => it.productId === product.id);

        expect(viewsAfter.length).toBe(0);
    });

    it('should update "view__product_view"', async () => {
        const author = await TestFactory.createAuthor();
        const category = await TestFactory.createCategory();
        const product1 = await TestFactory.createProduct({authorId: author.id, categoryId: category.id});
        const product2 = await TestFactory.createProduct({authorId: author.id, categoryId: category.id});

        await pMap(range(12), async () => TestFactory.createProductView({productId: product1.id}), {concurrency: 4});
        await pMap(range(8), async () => TestFactory.createProductView({productId: product2.id}), {concurrency: 4});

        const viewsCount = await TestFactory.getProductsViewsCount();

        expect(sortBy(viewsCount, 'count')).toMatchObject([
            {productId: product2.id, count: 8},
            {productId: product1.id, count: 12}
        ]);
    });

    it('should throw 404', async () => {
        const {statusCode, body} = await got.put<any>(`${url}${PATH.replace(':code', uuidv4())}`, {
            responseType: 'json',
            throwHttpErrors: false,
            headers
        });

        expect(statusCode).toBe(404);
        expect(body).toMatchObject({
            message: 'ENTITY_NOT_FOUND'
        });
    });
});
