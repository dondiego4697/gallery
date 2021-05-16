/* eslint-disable @typescript-eslint/no-explicit-any */
import Joi from '@hapi/joi';
import got from 'got';
import {range, shuffle} from 'lodash';
import pMap from 'p-map';

import {TestFactory} from 'test/test-factory';
import {TestServer} from 'test/test-server';

const PATH = '/api/v1/morda';

const authorSchema = Joi.object({
    code: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    avatarUrl: Joi.string().required(),
    professions: Joi.array().items(Joi.string()).required()
});

const productSchema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    releaseYear: Joi.number(),
    photos: Joi.array().items(Joi.string()).required(),
    size: Joi.object({
        width: Joi.number().required(),
        height: Joi.number().required(),
        length: Joi.number()
    }).required(),
    meta: Joi.object({
        views: Joi.number().required(),
        isLike: Joi.boolean().required()
    }).required(),
    author: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    }).required()
});

const selectionSchema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    imageUrl: Joi.string().required(),
    sortOrder: Joi.number().required(),
    createdAt: Joi.date().required()
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

    it('should return valid schema', async () => {
        const authors = await pMap(range(10), async () => TestFactory.createAuthor());
        const proffessions = await pMap(range(10), async () => TestFactory.createProfession());

        await pMap(authors, async (author) => {
            const shuffledProffessions = shuffle(proffessions);

            return TestFactory.createAuthorProfession({
                professionId: shuffledProffessions[0].id,
                authorId: author.id
            });
        });

        const categories = await pMap(range(10), async () => TestFactory.createCategory());
        const selections = await pMap(range(10), async (i) =>
            TestFactory.createSelection({
                selection: {
                    sortOrder: i
                }
            })
        );

        const products = await pMap(range(20), async () => {
            const shuffledAuthors = shuffle(authors);
            const shuffledCategories = shuffle(categories);

            return TestFactory.createProduct({
                authorId: shuffledAuthors[0].id,
                categoryId: shuffledCategories[0].id
            });
        });

        await pMap(products, async (product) =>
            Promise.all([
                TestFactory.createProductPhoto({
                    productId: product.id
                })
            ])
        );

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(200);
        expect(body.authors).toHaveLength(6);
        expect(body.products).toHaveLength(12);
        expect(body.selections).toHaveLength(selections.length);

        expect(body.authors.map((it: any) => authorSchema.validate(it).error).filter(Boolean)).toEqual([]);

        expect(body.products.map((it: any) => productSchema.validate(it).error).filter(Boolean)).toEqual([]);

        expect(body.selections.map((it: any) => selectionSchema.validate(it).error).filter(Boolean)).toEqual([]);
    });
});
