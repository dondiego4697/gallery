import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Picture} from 'entity/picture';

@Entity()
export class PictureStyle {
    @PrimaryGeneratedColumn({type: 'smallint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;

    @OneToMany(() => Picture, (picture) => picture.style)
    pictures: Picture[];
}
