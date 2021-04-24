/* eslint-disable @typescript-eslint/no-explicit-any */
import got from 'got';

import {TestServer} from 'test/test-server';
import {TestFactory} from 'test/test-factory';
import {Selection} from 'entity/selection';

const PATH = '/api/v1/morda';

function makeSelectionItem(selection: Selection) {
    return {
        publicId: selection.publicId,
        name: selection.name,
        description: selection.description,
        imageUrl: selection.imageUrl,
        createdAt: selection.createdAt.toISOString()
    };
}

describe(`GET ${PATH}`, () => {
    const testServer = new TestServer();
    let url: string;

    beforeAll(async () => {
        url = await testServer.getServerAddress();
    });

    afterAll(async () => {
        await testServer.stopServer();
    });

    it('should return selections in tree', async () => {
        const selection_1 = await TestFactory.createSelection();
        const selection_2 = await TestFactory.createSelection();
        const selection_1_1 = await TestFactory.createSelection(selection_1.id);
        const selection_1_2 = await TestFactory.createSelection(selection_1.id);
        const selection_1_2_1 = await TestFactory.createSelection(selection_1_2.id);
        const selection_2_1 = await TestFactory.createSelection(selection_2.id);

        const {statusCode, body} = await got.get<any>(`${url}${PATH}`, {
            responseType: 'json',
            throwHttpErrors: false
        });

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            selections: [
                {
                    item: makeSelectionItem(selection_1),
                    childrens: [
                        {
                            item: makeSelectionItem(selection_1_1),
                            childrens: []
                        },
                        {
                            item: makeSelectionItem(selection_1_2),
                            childrens: [
                                {
                                    item: makeSelectionItem(selection_1_2_1),
                                    childrens: []
                                }
                            ]
                        }
                    ]
                },
                {
                    item: makeSelectionItem(selection_2),
                    childrens: [
                        {
                            item: makeSelectionItem(selection_2_1),
                            childrens: []
                        }
                    ]
                }
            ]
        });
    });
});
