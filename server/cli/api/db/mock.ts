import pMap from 'p-map';
import {range, random, shuffle} from 'lodash';
import {TestFactory} from 'test/test-factory';
import {restoreDb} from 'test/restore-db';

export async function handle() {
    await restoreDb('development');

    // Авторы
    const authors = await pMap(
        range(10),
        async () => {
            const {id} = await TestFactory.createAuthor();

            return id;
        },
        {concurrency: 10}
    );

    // Картины
    const pictures = await pMap(
        range(100),
        async () => {
            const {id} = await TestFactory.createPicture({
                authorId: authors[random(authors.length - 1)]
            });

            return id;
        },
        {concurrency: 10}
    );

    // Просмотры картин
    await pMap(
        pictures,
        async (id) => {
            range(random(10, 50)).map(() => TestFactory.createPictureView(id));
        },
        {concurrency: 10}
    );

    // Фото картин
    await pMap(
        pictures,
        async (id) => {
            range(2, 5).map(() => TestFactory.createPicturePhoto(id));
        },
        {concurrency: 10}
    );

    // Подборки
    const selections = await pMap(
        range(50),
        async () => {
            const {id} = await TestFactory.createSelection();

            return id;
        },
        {concurrency: 10}
    );

    // Фото в подборках
    await pMap(
        selections,
        async (selectionId) => {
            shuffle(pictures)
                .slice(0, 20)
                .map((pictureId) => TestFactory.createSelectionPicture(selectionId, pictureId));
        },
        {concurrency: 10}
    );
}
