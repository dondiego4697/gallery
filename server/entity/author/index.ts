import {nanoid} from 'nanoid';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

import {City} from 'entity/city';
import {DbTable} from 'entity/const';
import {Product} from 'entity/product';
import {Profession} from 'entity/profession';

@Entity()
export class Author {
    @BeforeInsert()
    _beforeInsert() {
        this.code = this.code || nanoid();
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    firstName: string;

    @Column({type: 'text'})
    lastName: string;

    @Column({type: 'text', nullable: true})
    avatarUrl?: string;

    @Column({type: 'text', nullable: true})
    bio?: string;

    @Column({type: 'bigint', nullable: true})
    cityId?: number;

    @ManyToOne(() => City, (city) => city.authors)
    city: City;

    @OneToMany(() => Product, (product) => product.author)
    products: Product[];

    @Column({type: 'timestamp with time zone'})
    createdAt: Date;

    @ManyToMany(() => Profession)
    @JoinTable({
        name: DbTable.AUTHOR_PROFESSION,
        joinColumn: {
            name: 'author_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'profession_id',
            referencedColumnName: 'id'
        }
    })
    professions: Profession[];
}
