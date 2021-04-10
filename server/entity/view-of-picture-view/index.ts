import {DbView} from 'entity/const';
import {ViewColumn, ViewEntity} from 'typeorm';

@ViewEntity({name: DbView.PICTURE_VIEW})
export class ViewOfPictureView {
    @ViewColumn()
    pictureId: number;

    @ViewColumn()
    count: number;
}
