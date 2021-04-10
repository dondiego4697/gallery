import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Author} from 'entity/author';
import {PicturePhoto} from 'entity/picture-photo';

type Shape = '';
type Style = '';

@Entity()
export class Picture {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'integer', nullable: true})
    width?: number;

    @Column({type: 'integer', nullable: true})
    height?: number;

    @Column({type: 'text', nullable: true})
    shape?: Shape;

    @Column({type: 'text', nullable: true})
    style?: Style;

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
