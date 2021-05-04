import pMap from 'p-map';
import {range, random, shuffle} from 'lodash';
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
        async () => {
            const {id} = await TestFactory.createAuthor({
                cityId: cities[random(0, cities.length - 1)].id
            });

            return id;
        },
        {concurrency}
    );

    // Профессии
    console.log('professions...');
    const professions = await pMap(
        range(30),
        async () => {
            const {id} = await TestFactory.createProfession();

            return id;
        },
        {concurrency}
    );

    // Профессии авторов
    console.log('authors professions...');
    await pMap(
        authors,
        async (authorId) => {
            await TestFactory.createAuthorProfession({
                authorId,
                professionId: professions[random(0, professions.length - 1)]
            });
        },
        {concurrency}
    );

    // Категории продуктов
    console.log('product categories...');
    const productCategories = await Promise.all(
        ['Картина', 'Скульптура', 'Принт'].map((name) =>
            TestFactory.createProductCategory({
                productCategory: {
                    name
                }
            })
        )
    );

    const styles = [
        'Импрессионизм',
        'Экспрессионизм',
        'Кубизм',
        'Романтизм',
        'Неоклассицизм',
        'Поп – арт',
        'Романтизм',
        'Реализм',
        'Сюрреализм',
        'Символизм',
        'Абстракционизм',
        'Портрет',
        'Стрит – арт',
        'Натюрморт',
        'Минимализм'
    ].map((it) => it.toLowerCase());
    const materials = ['Фотобумага', 'Цифровая фотография', 'Ватман', 'Полотно'].map((it) => it.toLowerCase());
    const shapeFormats = [
        'Квадрат',
        'Круг',
        'Вертикальный',
        'Горизонтальный',
        'Круг / овал',
        'Триптих',
        'Диптих',
        'Другое'
    ].map((it) => it.toLowerCase());

    // Продукты
    console.log('products...');
    const products = await pMap(
        range(500),
        async () => {
            const index = random(0, productCategories.length - 1);

            const category = productCategories[index];

            const {id} = await TestFactory.createProduct({
                authorId: authors[random(0, authors.length - 1)],
                productCategoryId: category.id,
                product: {
                    style: styles[random(0, styles.length - 1)],
                    material: materials[random(0, materials.length - 1)],
                    shapeFormat: shapeFormats[random(0, shapeFormats.length - 1)]
                }
            });

            return id;
        },
        {concurrency}
    );

    // Фото продуктов
    console.log('products photos...');
    await pMap(
        products,
        async (productId) => {
            await Promise.all(
                range(0, random(5, 10)).map(() =>
                    TestFactory.createProductPhoto({
                        productId
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
        async (productId) => {
            await Promise.all(
                range(0, random(1, 100)).map(() =>
                    TestFactory.createProductView({
                        productId
                    })
                )
            );
        },
        {concurrency}
    );

    // Интерьеры
    console.log('interiors...');
    await pMap(
        range(100),
        async () => {
            const {id} = await TestFactory.createInterior();

            return id;
        },
        {concurrency}
    );

    // Подборки
    console.log('selections...');
    const selections = await pMap(
        range(10),
        async () => {
            const {id: parentId} = await TestFactory.createSelection();
            const {id} = await TestFactory.createSelection({parentId});

            return id;
        },
        {concurrency}
    );

    // Продукты в подборках
    console.log('products selections...');
    await pMap(
        products,
        async (productId) => {
            const shuffledSelections = shuffle(selections);

            await Promise.all(
                range(2, random(3, 10)).map((_, i) =>
                    TestFactory.createProductSelection({
                        productId,
                        selectionId: shuffledSelections[i]
                    })
                )
            );
        },
        {concurrency}
    );

    // Теги
    console.log('tags...');
    const tags = await pMap(
        range(100),
        async () => {
            const {id} = await TestFactory.createTag();

            return id;
        },
        {concurrency}
    );

    // Продукты к тегам
    console.log('products tags...');
    await pMap(
        products,
        async (productId) => {
            const shuffledTags = shuffle(tags);

            await Promise.all(
                range(0, random(3, 10)).map((_, i) =>
                    TestFactory.createProductTag({
                        productId,
                        tagId: shuffledTags[i]
                    })
                )
            );
        },
        {concurrency}
    );
}
