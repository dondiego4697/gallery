import pMap from 'p-map';
import casual from 'casual';
import {range, random, shuffle, uniq, flatten} from 'lodash';
import {TestFactory} from 'test/test-factory';
import {restoreDb} from 'test/restore-db';

const concurrency = 10;

export async function handle() {
    await restoreDb('development');

    // Страны
    console.log('countries...');
    const countries = await pMap(
        range(20),
        async () => {
            const {id} = await TestFactory.createCountry();

            return id;
        },
        {concurrency}
    );

    // Города
    console.log('cities...');
    const cities = flatten(
        await pMap(
            countries,
            async (countryId) => {
                const items = await Promise.all(range(10).map(() => TestFactory.createCity({countryId})));

                return items.map((it) => it.id);
            },
            {concurrency}
        )
    );

    // Авторы
    console.log('authors...');
    const authors = await pMap(
        range(100),
        async () => {
            const {id} = await TestFactory.createAuthor({
                cityId: cities[random(0, cities.length - 1)]
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
    const productCategories = await pMap(
        range(10),
        async () => {
            const {id} = await TestFactory.createProductCategory();

            return id;
        },
        {concurrency}
    );

    const styles = uniq(range(20).map(() => casual.word));
    const materials = uniq(range(20).map(() => casual.word));

    // Продукты
    console.log('products...');
    const products = await pMap(
        range(500),
        async () => {
            const index = random(0, productCategories.length - 1);

            const category = productCategories[index];

            const {id} = await TestFactory.createProduct({
                authorId: authors[random(0, authors.length - 1)],
                productCategoryId: category,
                product: {
                    style: styles[random(0, styles.length - 1)],
                    material: materials[random(0, materials.length - 1)]
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
        range(50),
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
