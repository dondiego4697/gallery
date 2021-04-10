import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Picture} from 'entity/picture';

@Entity()
export class Author {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    publicId: string;

    @Column({type: 'text', nullable: true})
    avatarUrl?: string;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'text', nullable: true})
    bio?: string;

    @Column({type: 'boolean'})
    isGallery: boolean;

    @OneToMany(() => Picture, (picture) => picture.author)
    pictures: Picture[];
}
