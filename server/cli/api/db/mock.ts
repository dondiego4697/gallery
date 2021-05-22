import {flatten, random, range, shuffle} from 'lodash';
import pMap from 'p-map';

import {config} from 'app/config';
import {restoreDb} from 'test/restore-db';
import {TestFactory} from 'test/test-factory';

const s3Prefix = `https://${config['s3.host']}/${config['s3.bucketName']}`;
const concurrency = 10;

function getRandomItem<T>(items: T[], count: number): T[];
function getRandomItem<T>(items: T[]): T;
function getRandomItem<T>(items: T[], count?: number) {
    const shuffled = shuffle(items);

    if (count !== undefined) {
        return shuffled.slice(0, count);
    }

    return shuffled[0];
}

export async function handle() {
    await restoreDb('development');

    // Страны
    console.log('countries...');
    const RU = await TestFactory.createCountry({
        country: {
            code: 'RU',
            name: 'Россия'
        }
    });

    // Города
    console.log('cities...');
    const cities = await Promise.all(
        ['Mocква', 'Санкт-Петербург', 'Казань', 'Йошкар-Ола'].map((name) =>
            TestFactory.createCity({
                countryId: RU.id,
                city: {
                    name
                }
            })
        )
    );

    const authorPhotos = [
        `${s3Prefix}/authors/5e95ca74-ce32-40f2-90a0-296db6895f10.png`,
        `${s3Prefix}/authors/9a431f89-c385-42ef-aca4-d3ffee0effbd.png`,
        `${s3Prefix}/authors/afa052d0-0437-418a-b58c-e9e4a9c937f0.png`,
        `${s3Prefix}/authors/d9e6eebd-8e0f-449e-9a80-b0644b7c8df2.png`,
        `${s3Prefix}/authors/ea74be70-ac64-4786-a7df-b5aec438f0bf.png`,
        `${s3Prefix}/authors/f7ae9b17-1f2a-4f89-8ab3-100b3847617c.png`
    ];

    // Авторы
    console.log('authors...');
    const authors = await pMap(
        range(100),
        async () => {
            return TestFactory.createAuthor({
                cityId: cities[random(0, cities.length - 1)].id,
                author: {
                    avatarUrl: getRandomItem(authorPhotos)
                }
            });
        },
        {concurrency}
    );

    // Профессии
    console.log('professions...');
    const professions = await pMap(range(30), async () => TestFactory.createProfession(), {concurrency});

    // Профессии авторов
    console.log('authors professions...');
    await pMap(
        authors,
        async (author) => {
            await TestFactory.createAuthorProfession({
                authorId: author.id,
                professionId: getRandomItem(professions).id
            });
        },
        {concurrency}
    );

    // Категории
    console.log('categories...');
    const categories = await Promise.all(
        ['Живопись', 'Скульптура', 'Принт', 'Фотография'].map((name) =>
            TestFactory.createCategory({
                category: {
                    name
                }
            })
        )
    );

    // Стили
    console.log('styles...');
    const styles = await Promise.all(
        [
            'Импрессионизм',
            'Экспрессионизм',
            'Кубизм',
            'Романтизм',
            'Неоклассицизм',
            'Поп – арт',
            'Реализм',
            'Сюрреализм',
            'Символизм',
            'Абстракционизм',
            'Портрет',
            'Стрит – арт',
            'Натюрморт',
            'Минимализм'
        ].map((name) => TestFactory.createStyle({style: {name}}))
    );

    // Материалы
    console.log('materials...');
    const materials = await Promise.all(
        ['Фотобумага', 'Цифровая фотография', 'Ватман', 'Полотно'].map((name) =>
            TestFactory.createMaterial({material: {name}})
        )
    );

    // Формы
    console.log('shape formats...');
    const shapeFormats = await Promise.all(
        [
            'Квадрат',
            'Круг',
            'Вертикальный',
            'Горизонтальный',
            'Круг / овал',
            'Триптих',
            'Диптих',
            'Другое'
        ].map((name) => TestFactory.createShapeFormat({shapeFormat: {name}}))
    );

    // Галлереи
    console.log('galleries...');
    const galleries = await pMap(range(10), async () => {
        return TestFactory.createGallery();
    });

    // Продукты
    console.log('products...');
    const products = await pMap(
        range(500),
        async () => {
            const index = random(0, categories.length - 1);

            const category = categories[index];

            return TestFactory.createProduct({
                authorId: authors[random(0, authors.length - 1)].id,
                categoryId: category.id,
                galleryId: Math.random() > 0.5 ? getRandomItem(galleries).id : undefined,
                product: {
                    styleId: Math.random() > 0.4 ? getRandomItem(styles).id : undefined,
                    materialId: Math.random() > 0.4 ? getRandomItem(materials).id : undefined,
                    shapeFormatId: Math.random() > 0.4 ? getRandomItem(shapeFormats).id : undefined
                }
            });
        },
        {concurrency}
    );

    // Цвета
    console.log('color...');
    const colors = await Promise.all(range(0, 10).map(() => TestFactory.createColor()));

    // Цвета продуктов
    console.log('products colors...');
    await pMap(
        products,
        async (product) => {
            await Promise.all(
                getRandomItem(colors, 3).map((color) =>
                    TestFactory.createProductColor({
                        productId: product.id,
                        colorId: color.id
                    })
                )
            );
        },
        {concurrency}
    );

    const productPhotos = [
        `${s3Prefix}/products/023f95c8-77bb-4a3e-a7bb-600c9b56dd7f.png`,
        `${s3Prefix}/products/05b41588-c7f8-480d-88fb-7227aec1958d.png`,
        `${s3Prefix}/products/0d26fe95-e964-4288-bcb3-256a568798d1.png`,
        `${s3Prefix}/products/2545013c-eec9-4169-8897-1c3074aa21fe.png`,
        `${s3Prefix}/products/2d6bd722-41be-4a8c-b764-4ac7c6039057.png`,
        `${s3Prefix}/products/38eae298-8298-4c2b-ac37-374b743da7c8.png`,
        `${s3Prefix}/products/3ce89881-16a8-4873-9352-8e80f44e8229.png`,
        `${s3Prefix}/products/9e5265be-d892-4837-90b1-300563bbddd6.png`,
        `${s3Prefix}/products/c081598c-3024-41b5-a53f-8c9808362ad3.png`,
        `${s3Prefix}/products/f96dd2f0-83d5-40b9-b704-77d313f0a24f.png`,
        `${s3Prefix}/products/f9e8bbc7-3532-4bbe-ad68-29a4da47574e.png`
    ];

    // Фото продуктов
    console.log('products photos...');
    await pMap(
        products,
        async (product) => {
            await Promise.all(
                getRandomItem(productPhotos, random(1, productPhotos.length - 1)).map((photoUrl) =>
                    TestFactory.createProductPhoto({
                        productId: product.id,
                        photoUrl
                    })
                )
            );
        },
        {concurrency}
    );

    // Просмотры продуктов
    console.log('products views...');
    await pMap(
        products,
        async (product) =>
            TestFactory.createProductView({
                productId: product.id,
                count: random(0, 500)
            }),
        {concurrency}
    );

    // Интерьеры
    console.log('interiors...');

    // https://storage.yandexcloud.net/gallerian/interiors/2047b6ec-07d1-4af2-b9d2-7e52adc7938c.jpeg

    const interiorsPhotos = [
        `${s3Prefix}/interiors/2047b6ec-07d1-4af2-b9d2-7e52adc7938c.jpeg`,
        `${s3Prefix}/interiors/94162c57-e187-4157-95ba-30378d02a7c5.jpeg`,
        `${s3Prefix}/interiors/bf861e7c-5d4b-4e7d-b5b6-da020eea93c2.jpeg`
    ];

    const interiorsCoords = [
        [600, 230, 200, 300],
        [620, 160, 230, 200],
        [620, 200, 200, 200]
    ];

    await pMap(
        interiorsPhotos,
        async (url, i) => {
            const coords = interiorsCoords[i];

            return TestFactory.createInterior({
                interior: {
                    photoUrl: url,
                    x: coords[0],
                    y: coords[1],
                    maxPictureHeight: coords[2],
                    maxPictureWidth: coords[3]
                }
            });
        },
        {concurrency}
    );

    // Подборки
    console.log('selections...');

    const selectionPhotos = [
        `${s3Prefix}/selections/00325eb0-680c-4624-aeb2-7d5a3bcd086e.png`,
        `${s3Prefix}/selections/2b9c0767-ed16-4316-91e4-f42b3b820a1b.png`,
        `${s3Prefix}/selections/48873750-d192-4b1d-8e2b-6efc9cab40e6.png`,
        `${s3Prefix}/selections/878cd3b6-0aa2-40e5-b791-d4051c6e6a87.png`,
        `${s3Prefix}/selections/bf10b779-55e6-4f4f-96cd-62df36efea21.png`
    ];

    const selections = flatten(
        await pMap(
            [
                'Новинки',
                'Молодые авторы',
                ['Для дома', ['Спальня', 'Гостинная', 'Кухня', 'Детская', 'Прихожая/Холл', 'Ванная']],
                ['Для организаций', ['Кофейня', 'Хостел', 'Отель', 'Ресторан', 'Кафе', 'Кальянная']],
                ['Стиль интерьера', ['Ар-деко', 'Классика', 'Лофт', 'Минимализм', 'Кантри', 'Скандинавский']],
                'Цветовой тон',
                'Новые художники',
                'Спец. предложения'
            ] as (string | [string, string[]])[],
            async (it, i) => {
                if (Array.isArray(it)) {
                    const {id: parentId} = await TestFactory.createSelection({
                        selection: {
                            name: it[0],
                            sortOrder: i,
                            imageUrl: getRandomItem(selectionPhotos)
                        }
                    });

                    return Promise.all(
                        it[1].map((name, j) =>
                            TestFactory.createSelection({
                                parentId,
                                selection: {
                                    name,
                                    sortOrder: j,
                                    imageUrl: getRandomItem(selectionPhotos)
                                }
                            })
                        )
                    );
                } else {
                    return TestFactory.createSelection({
                        selection: {
                            name: it,
                            sortOrder: i,
                            imageUrl: getRandomItem(selectionPhotos)
                        }
                    });
                }
            },
            {concurrency}
        )
    );

    // Продукты в подборках
    console.log('products selections...');
    await pMap(
        products,
        async (product) => {
            await Promise.all(
                getRandomItem(selections, random(3, 10)).map((selection) =>
                    TestFactory.createProductSelection({
                        productId: product.id,
                        selectionId: selection.id
                    })
                )
            );
        },
        {concurrency}
    );

    // Теги
    console.log('tags...');
    const tags = await pMap(range(100), async () => TestFactory.createTag(), {concurrency});

    // Продукты к тегам
    console.log('products tags...');
    await pMap(
        products,
        async (product) => {
            await TestFactory.createProductTag({
                productId: product.id,
                tagIds: getRandomItem(tags, random(3, 10)).map((it) => it.id)
            });
        },
        {concurrency}
    );
}
