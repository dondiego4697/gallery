import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Picture} from 'entity/picture';

@Entity()
export class PicturePhoto {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    pictureId: number;

    @Column({type: 'text'})
    photoUrl: string;

    @ManyToOne(() => Picture, (picture) => picture.photos)
    picture: Picture;
}
