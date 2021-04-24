/* eslint-disable @typescript-eslint/no-explicit-any */
import {v4 as uuidv4} from 'uuid';
import casual from 'casual';
import {keyBy} from 'lodash';
import {dbManager} from 'app/lib/db-manager';
import {User} from 'entity/user';
import {Author} from 'entity/author';
import {Picture} from 'entity/picture';
import {PictureView} from 'entity/picture-view';
import {ViewOfPictureView} from 'entity/view-of-picture-view';
import {PicturePhoto} from 'entity/picture-photo';
import {Selection} from 'entity/selection';
import {SelectionPicture} from 'entity/selection-picture';
import {PictureStyle} from 'entity/picture-style';
import {PictureShape} from 'entity/picture-shape';
import {Interior} from 'entity/interior';
import {PictureLike} from 'entity/picture-like';

async function createUser() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(User);

    const user = manager.create(User, {
        email: casual.email
    });

    await manager.save(user);

    return manager.findOneOrFail(User, user.id);
}

async function createAuthor() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Author);

    const author = manager.create(Author, {
        name: casual.full_name,
        avatarUrl: casual.url
    });

    await manager.save(author);

    return manager.findOneOrFail(Author, author.id);
}

async function createPictureShape() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PictureShape);

    const shape = manager.create(PictureShape, {
        code: uuidv4(),
        name: casual.words(10)
    });

    await manager.save(shape);

    return manager.findOneOrFail(PictureShape, shape.id);
}

async function createPictureStyle() {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PictureStyle);

    const style = manager.create(PictureStyle, {
        code: uuidv4(),
        name: casual.words(10)
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
        name: casual.words(10),
        width: casual.integer(10, 100),
        height: casual.integer(10, 100),
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
        fingerprint: uuidv4()
    });

    await manager.save(pictureView);

    return manager.findOneOrFail(PictureView, pictureView.id);
}

async function createPictureLike(pictureId: number, userId: number) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PictureLike);

    const pictureLike = manager.create(PictureLike, {
        pictureId,
        userId
    });

    await manager.save(pictureLike);

    return manager.findOneOrFail(PictureLike, pictureLike.id);
}

async function createPicturePhoto(pictureId: number) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(PicturePhoto);

    const picturePhoto = manager.create(PicturePhoto, {
        pictureId,
        photoUrl: casual.url
    });

    await manager.save(picturePhoto);

    return manager.findOneOrFail(PicturePhoto, picturePhoto.id);
}

async function createSelection(parentId?: number) {
    const connection = await dbManager.getConnection();
    const {manager} = connection.getRepository(Selection);

    const selection = manager.create(Selection, {
        name: casual.words(6),
        description: casual.sentences(10),
        imageUrl: casual.url,
        parentId
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
        photoUrl: casual.url,
        ...params
    });

    await manager.save(interior);

    return manager.findOneOrFail(Interior, interior.id);
}

async function getPictureShapesHash() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(PictureShape).createQueryBuilder('picShape');

    const rows = await qb.getMany();

    return keyBy(rows, 'id');
}

async function getPictureStylesHash() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(PictureStyle).createQueryBuilder('picStyle');

    const rows = await qb.getMany();

    return keyBy(rows, 'id');
}

async function getPictures() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(Picture).createQueryBuilder('pic');

    return qb.getMany();
}

async function getPicturesLikes() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(PictureLike).createQueryBuilder('like');

    return qb.getMany();
}

async function getPicturesViews() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(PictureView).createQueryBuilder('view');

    return qb.getMany();
}

async function getPicturesViewsCount() {
    const connection = await dbManager.getConnection();

    const qb = connection.getRepository(ViewOfPictureView).createQueryBuilder('viewOfPictureView');

    return qb.getMany();
}

export const TestFactory = {
    createUser,
    createAuthor,
    createPicture,
    createPictureShape,
    createPictureStyle,
    createPictureView,
    createPictureLike,
    createPicturePhoto,
    createSelection,
    createSelectionPicture,
    createInterior,
    getPictureShapesHash,
    getPictureStylesHash,
    getPictures,
    getPicturesLikes,
    getPicturesViews,
    getPicturesViewsCount
};
