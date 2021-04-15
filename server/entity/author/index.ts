import {Column, Entity, BeforeInsert, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Picture} from 'entity/picture';
import {nanoid} from 'nanoid';

@Entity()
export class Author {
    @BeforeInsert()
    _beforeInsert() {
        this.publicId = nanoid();
    }

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

    @Column({type: 'timestamp with time zone'})
    createdAt: Date;
}
