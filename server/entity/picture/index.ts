import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Author} from 'entity/author';
import {PicturePhoto} from 'entity/picture-photo';
import {PictureShape} from 'entity/picture-shape';
import {PictureStyle} from 'entity/picture-style';

@Entity()
export class Picture {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    publicId: string;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'integer'})
    width: number;

    @Column({type: 'integer'})
    height: number;

    @Column({type: 'smallint'})
    shapeId: number;

    @ManyToOne(() => PictureShape, (pictureShape) => pictureShape.pictures)
    shape: PictureShape;

    @Column({type: 'smallint'})
    styleId: number;

    @ManyToOne(() => PictureStyle, (pictureStyle) => pictureStyle.pictures)
    style: PictureStyle;

    @Column({type: 'bigint'})
    authorId: number;

    @ManyToOne(() => Author, (author) => author.pictures)
    author: Author;

    @Column({type: 'boolean'})
    isSold: boolean;

    @Column({type: 'timestamp with time zone'})
    createdAt: Date;

    @OneToMany(() => PicturePhoto, (photo) => photo.picture)
    photos: PicturePhoto[];
}
