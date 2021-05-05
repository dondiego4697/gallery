import pMap from 'p-map';
import {range, flatten, random, shuffle} from 'lodash';
import {TestFactory} from 'test/test-factory';
import {restoreDb} from 'test/restore-db';

const concurrency = 10;

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

    // Авторы
    console.log('authors...');
    const authors = await pMap(
        range(100),
        async () =>
            TestFactory.createAuthor({
                cityId: cities[random(0, cities.length - 1)].id
            }),
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
                professionId: professions[random(0, professions.length - 1)].id
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
                galleryId: Math.random() > 0.5 ? galleries[random(0, galleries.length - 1)].id : undefined,
                product: {
                    styleId: Math.random() > 0.4 ? styles[random(0, styles.length - 1)].id : undefined,
                    materialId: Math.random() > 0.4 ? materials[random(0, materials.length - 1)].id : undefined,
                    shapeFormatId: Math.random() > 0.4 ? shapeFormats[random(0, shapeFormats.length - 1)].id : undefined
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
            const shuffledColors = shuffle(colors);

            await Promise.all(
                range(0, 3).map((i) =>
                    TestFactory.createProductColor({
                        productId: product.id,
                        colorId: shuffledColors[i].id
                    })
                )
            );
        },
        {concurrency}
    );

    // Фото продуктов
    console.log('products photos...');
    await pMap(
        products,
        async (product) => {
            await Promise.all(
                range(0, random(5, 10)).map(() =>
                    TestFactory.createProductPhoto({
                        productId: product.id
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
    await pMap(range(100), async () => TestFactory.createInterior(), {concurrency});

    // Подборки
    console.log('selections...');
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
            async (it) => {
                if (Array.isArray(it)) {
                    const {id: parentId} = await TestFactory.createSelection({
                        selection: {name: it[0]}
                    });

                    return Promise.all(it[1].map((name) => TestFactory.createSelection({parentId, selection: {name}})));
                } else {
                    return TestFactory.createSelection({
                        selection: {
                            name: it
                        }
                    });
                }
            },
            {concurrency: 1}
        )
    );

    // Продукты в подборках
    console.log('products selections...');
    await pMap(
        products,
        async (product) => {
            const shuffledSelections = shuffle(selections);

            await Promise.all(
                range(2, random(3, 10)).map((_, i) =>
                    TestFactory.createProductSelection({
                        productId: product.id,
                        selectionId: shuffledSelections[i].id
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
            const shuffledTags = shuffle(tags);

            await TestFactory.createProductTag({
                productId: product.id,
                tagIds: range(0, random(3, 10)).map((_, i) => shuffledTags[i].id)
            });
        },
        {concurrency}
    );
}
