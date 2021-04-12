/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import {random} from 'lodash';
import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';
import {Picture} from 'entity/picture';
import {PictureView} from 'entity/picture-view';
import {PicturePhoto} from 'entity/picture-photo';
import {Selection} from 'entity/selection';
import {SelectionPicture} from 'entity/selection-picture';
import {PictureStyle} from 'entity/picture-style';
import {PictureShape} from 'entity/picture-shape';
import {Interior} from 'entity/interior';

async function createAuthor() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Author);

    const author = manager.create(Author, {
        name: faker.name.firstName() + ' ' + faker.name.lastName(),
        avatarUrl: faker.internet.avatar()
    });

    await manager.save(author);

    return manager.findOneOrFail(Author, author.id);
}

async function createPictureShape() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PictureShape);

    const shape = manager.create(PictureShape, {
        name: faker.lorem.word()
    });

    await manager.save(shape);

    return manager.findOneOrFail(PictureShape, shape.id);
}

async function createPictureStyle() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PictureStyle);

    const style = manager.create(PictureStyle, {
        name: faker.lorem.word()
    });

    await manager.save(style);

    return manager.findOneOrFail(PictureStyle, style.id);
}

interface CreatePictureParams {
    authorId: number;
    styleId?: number;
    shapeId?: number;
}

async function createPicture(params: CreatePictureParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Picture);

    const picture = manager.create(Picture, {
        name: faker.random.words(random(5, 10)),
        width: faker.random.number(),
        height: faker.random.number(),
        shapeId: params.shapeId || (await createPictureShape()).id,
        styleId: params.styleId || (await createPictureStyle()).id,
        authorId: params.authorId
    });

    await manager.save(picture);

    return manager.findOneOrFail(Picture, picture.id);
}

async function createPictureView(pictureId: number) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PictureView);

    const pictureView = manager.create(PictureView, {
        pictureId,
        fingerprint: faker.random.uuid()
    });

    await manager.save(pictureView);

    return manager.findOneOrFail(PictureView, pictureView.id);
}

async function createPicturePhoto(pictureId: number) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PicturePhoto);

    const picturePhoto = manager.create(PicturePhoto, {
        pictureId,
        photoUrl: faker.random.image()
    });

    await manager.save(picturePhoto);

    return manager.findOneOrFail(PicturePhoto, picturePhoto.id);
}

async function createSelection() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Selection);

    const selection = manager.create(Selection, {
        name: faker.lorem.words(6),
        description: faker.lorem.sentences(),
        imageUrl: faker.random.image()
    });

    await manager.save(selection);

    return manager.findOneOrFail(Selection, selection.id);
}

async function createSelectionPicture(selectionId: number, pictureId: number) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(SelectionPicture);

    const selectionPicture = manager.create(SelectionPicture, {
        selectionId,
        pictureId
    });

    await manager.save(selectionPicture);

    return manager.findOneOrFail(SelectionPicture, selectionPicture.id);
}

interface CreateInteriorParams {
    x: number;
    y: number;
    maxPictureHeight: number;
    maxPictureWidth: number;
}

async function createInterior(params: CreateInteriorParams) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Interior);

    const interior = manager.create(Interior, {
        photoUrl: faker.random.image(),
        ...params
    });

    await manager.save(interior);

    return manager.findOneOrFail(Interior, interior.id);
}

export const TestFactory = {
    createAuthor,
    createPicture,
    createPictureShape,
    createPictureStyle,
    createPictureView,
    createPicturePhoto,
    createSelection,
    createSelectionPicture,
    createInterior
};
