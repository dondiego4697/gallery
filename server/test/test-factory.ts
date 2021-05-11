/* eslint-disable @typescript-eslint/no-explicit-any */
import casual from 'casual';
import {random, range} from 'lodash';
import {DeepPartial} from 'typeorm';
import {v4 as uuidv4} from 'uuid';

import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';
import {AuthorProfession} from 'entity/author-profession';
import {Category} from 'entity/category';
import {City} from 'entity/city';
import {Color} from 'entity/color';
import {Country} from 'entity/country';
import {Gallery} from 'entity/gallery';
import {Interior} from 'entity/interior';
import {Material} from 'entity/material';
import {Product} from 'entity/product';
import {ProductColor} from 'entity/product-color';
import {ProductLike} from 'entity/product-like';
import {ProductPhoto} from 'entity/product-photo';
import {ProductSelection} from 'entity/product-selection';
import {ProductTag} from 'entity/product-tag';
import {ProductView} from 'entity/product-view';
import {Profession} from 'entity/profession';
import {Selection} from 'entity/selection';
import {ShapeFormat} from 'entity/shape-format';
import {Style} from 'entity/style';
import {Tag} from 'entity/tag';
import {User} from 'entity/user';
import {ViewOfProductView} from 'entity/view-of-product-view';

interface CreateCountryParams {
    country?: DeepPartial<Country>;
}

async function createCountry(params: CreateCountryParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Country);

    const entity = manager.create(Country, {
        code: params.country?.code || `${casual.country_code}_${casual.random}`,
        name: params.country?.name || `${casual.country}_${casual.random}`
    });

    await manager.save(entity);

    return manager.findOneOrFail(Country, entity.id);
}

interface CreateCityParams {
    countryId: number;
    city?: DeepPartial<City>;
}

async function createCity(params: CreateCityParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(City);

    const entity = manager.create(City, {
        name: params.city?.name || `${casual.city}_${casual.random}`,
        countryId: params.countryId
    });

    await manager.save(entity);

    return manager.findOneOrFail(City, entity.id);
}

interface CreateGalleryParams {
    gallery?: DeepPartial<Gallery>;
}

async function createGallery(params: CreateGalleryParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Gallery);

    const entity = manager.create(Gallery, {
        name: params.gallery?.name || `${casual.name}_${casual.random}`
    });

    await manager.save(entity);

    return manager.findOneOrFail(Gallery, entity.id);
}

async function createUser() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(User);

    const entity = manager.create(User, {
        email: casual.email
    });

    await manager.save(entity);

    return manager.findOneOrFail(User, entity.id);
}

interface CreateAuthorParams {
    cityId?: number;
    author?: DeepPartial<Author>;
}

async function createAuthor(params: CreateAuthorParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Author);

    const entity = manager.create(Author, {
        firstName: casual.first_name,
        lastName: casual.last_name,
        avatarUrl: casual.url + uuidv4(),
        bio: casual.sentences(10),
        cityId: params.cityId,
        ...(params.author || {})
    });

    await manager.save(entity);

    return manager.findOneOrFail(Author, entity.id);
}

interface CreateInteriorParams {
    interior?: DeepPartial<Interior>;
}

async function createInterior(params: CreateInteriorParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Interior);

    const entity = manager.create(Interior, {
        photoUrl: casual.url + uuidv4(),
        x: casual.integer(1, 100),
        y: casual.integer(1, 100),
        maxPictureHeightPercent: casual.integer(1, 100),
        maxPictureWidthPercent: casual.integer(1, 100),
        ...(params.interior || {})
    });

    await manager.save(entity);

    return manager.findOneOrFail(Interior, entity.id);
}

async function createProfession() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Profession);

    const entity = manager.create(Profession, {
        name: casual.words(4)
    });

    await manager.save(entity);

    return manager.findOneOrFail(Profession, entity.id);
}

async function createTag() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Tag);

    const entity = manager.create(Tag, {
        name: `${casual.word}_${casual.random}`
    });

    await manager.save(entity);

    return manager.findOneOrFail(Tag, entity.id);
}

interface CreateProductParams {
    product?: DeepPartial<Product>;
    galleryId?: number;
    authorId: number;
    categoryId: number;
}

async function createProduct(params: CreateProductParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Product);

    const entity = manager.create(Product, {
        name: casual.words(3),
        price: casual.integer(5000, 10000000),
        authorId: params.authorId,
        categoryId: params.categoryId,
        galleryId: params.galleryId,
        size: {
            width: casual.integer(10, 100),
            height: casual.integer(10, 100),
            length: Math.random() > 0.5 ? casual.integer(10, 100) : undefined
        },
        releaseYear: random(2000, 2021),
        ...(params.product || {})
    });

    await manager.save(entity);

    return manager.findOneOrFail(Product, entity.id);
}

interface CreateSelectionParams {
    parentId?: number;
    selection?: DeepPartial<Selection>;
}

async function createSelection(params: CreateSelectionParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Selection);

    const entity = manager.create(Selection, {
        name: params.selection?.name || casual.words(2),
        description: params.selection?.description || casual.sentences(10),
        imageUrl: casual.url + uuidv4(),
        parentId: params.parentId
    });

    await manager.save(entity);

    return manager.findOneOrFail(Selection, entity.id);
}

interface CreateCategoryParams {
    category?: DeepPartial<Category>;
}

async function createCategory(params: CreateCategoryParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Category);

    const entity = manager.create(Category, {
        name: params.category?.name || casual.words(3)
    });

    await manager.save(entity);

    return manager.findOneOrFail(Category, entity.id);
}

interface CreateAuthorProfessionParams {
    authorId: number;
    professionId: number;
}

async function createAuthorProfession(params: CreateAuthorProfessionParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(AuthorProfession);

    const entity = manager.create(AuthorProfession, {
        authorId: params.authorId,
        professionId: params.professionId
    });

    await manager.save(entity);

    return manager.findOneOrFail(AuthorProfession, entity.id);
}

interface CreateProductLikeParams {
    productId: number;
    userId: number;
}

async function createProductLike(params: CreateProductLikeParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(ProductLike);

    const entity = manager.create(ProductLike, {
        productId: params.productId,
        userId: params.userId
    });

    await manager.save(entity);

    return manager.findOneOrFail(ProductLike, entity.id);
}

async function createColor() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Color);

    const entity = manager.create(Color, {
        name: `${casual.color_name}_${casual.random}`,
        hex: casual.rgb_hex
    });

    await manager.save(entity);

    return manager.findOneOrFail(Color, entity.id);
}

interface CreateProductColorParams {
    productId: number;
    colorId: number;
}

async function createProductColor(params: CreateProductColorParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(ProductColor);

    const entity = manager.create(ProductColor, {
        productId: params.productId,
        colorId: params.colorId
    });

    await manager.save(entity);

    return manager.findOneOrFail(ProductColor, entity.id);
}

interface CreateStyleParams {
    style?: DeepPartial<Style>;
}

async function createStyle(params: CreateStyleParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Style);

    const entity = manager.create(Style, {
        name: casual.words(3),
        ...(params.style || {})
    });

    await manager.save(entity);

    return manager.findOneOrFail(Style, entity.id);
}

interface CreateMaterialParams {
    material?: DeepPartial<Material>;
}

async function createMaterial(params: CreateMaterialParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Material);

    const entity = manager.create(Material, {
        name: casual.words(3),
        ...(params.material || {})
    });

    await manager.save(entity);

    return manager.findOneOrFail(Material, entity.id);
}

interface CreateShapeFormatParams {
    shapeFormat?: DeepPartial<ShapeFormat>;
}

async function createShapeFormat(params: CreateShapeFormatParams = {}) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(ShapeFormat);

    const entity = manager.create(ShapeFormat, {
        name: casual.words(3),
        ...(params.shapeFormat || {})
    });

    await manager.save(entity);

    return manager.findOneOrFail(ShapeFormat, entity.id);
}

interface CreateProductPhotoParams {
    productId: number;
    photoUrl?: string;
}

async function createProductPhoto(params: CreateProductPhotoParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(ProductPhoto);

    const entity = manager.create(ProductPhoto, {
        productId: params.productId,
        photoUrl: params.photoUrl || casual.url + uuidv4()
    });

    await manager.save(entity);

    return manager.findOneOrFail(ProductPhoto, entity.id);
}

interface CreateProductTagParams {
    productId: number;
    tagIds: number[];
}

async function createProductTag(params: CreateProductTagParams) {
    const connection = await dbManager.getConnection();

    await connection
        .createQueryBuilder()
        .insert()
        .into(ProductTag)
        .values(
            params.tagIds.map((tagId) => ({
                productId: params.productId,
                tagId
            }))
        )
        .execute();
}

interface CreateProductViewParams {
    productId: number;
    count?: number;
    fingerprint?: string;
}

async function createProductView(params: CreateProductViewParams) {
    const count = params.count || 1;
    const connection = await dbManager.getConnection();

    await connection
        .createQueryBuilder()
        .insert()
        .into(ProductView)
        .values(
            range(0, count).map(() => ({
                productId: params.productId,
                fingerprint: count > 1 ? uuidv4() : params.fingerprint || uuidv4()
            }))
        )
        .execute();
}

interface CreateProductSelectionParams {
    productId: number;
    selectionId: number;
}

async function createProductSelection(params: CreateProductSelectionParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(ProductSelection);

    const entity = manager.create(ProductSelection, {
        productId: params.productId,
        selectionId: params.selectionId
    });

    await manager.save(entity);

    return manager.findOneOrFail(ProductSelection, entity.id);
}

async function getAuthors() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(Author).createQueryBuilder().getMany();
}

async function getProductsLikes() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(ProductLike).createQueryBuilder().getMany();
}

async function getProductsViews() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(ProductView).createQueryBuilder().getMany();
}

async function getProductsViewsCount() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(ViewOfProductView).createQueryBuilder().getMany();
}

async function getCities() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(City).createQueryBuilder().getMany();
}

async function getProducts() {
    const connection = await dbManager.getConnection();

    return connection.getRepository(Product).createQueryBuilder().getMany();
}

export const TestFactory = {
    createGallery,
    createCountry,
    createCity,
    createUser,
    createAuthor,
    createInterior,
    createProfession,
    createTag,
    createColor,
    createProductColor,
    createProduct,
    createSelection,
    createCategory,
    createAuthorProfession,
    createProductLike,
    createStyle,
    createMaterial,
    createShapeFormat,
    createProductPhoto,
    createProductTag,
    createProductView,
    createProductSelection,
    getAuthors,
    getProductsLikes,
    getProductsViews,
    getProductsViewsCount,
    getCities,
    getProducts
};
