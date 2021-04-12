import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Picture} from 'entity/picture';

@Entity()
export class PictureShape {
    @PrimaryGeneratedColumn({type: 'smallint'})
    id: number;

    @Column({type: 'text'})
    name: string;

    @OneToMany(() => Picture, (picture) => picture.shape)
    pictures: Picture[];
}
