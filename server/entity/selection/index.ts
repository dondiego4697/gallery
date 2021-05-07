import slugify from 'slugify';
import {BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';

import {DbTable} from 'entity/const';
import {Product} from 'entity/product';

@Entity()
export class Selection {
    @BeforeInsert()
    _beforeInsert() {
        this.code = slugify(this.name.toLowerCase(), '-');
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'text', nullable: true})
    description?: string;

    @Column({type: 'text'})
    imageUrl: string;

    @Column({type: 'boolean'})
    isActive: boolean;

    @Column({type: 'bigint', nullable: true})
    parentId?: number;

    @Column({type: 'ltree', generated: true})
    path: string;

    @Column({type: 'integer', generated: true})
    level: number;

    @Column({type: 'boolean', generated: true})
    isRoot: boolean;

    @Column({type: 'timestamp with time zone'})
    createdAt: Date;

    @ManyToMany(() => Product)
    @JoinTable({
        name: DbTable.PRODUCT_SELECTION,
        joinColumn: {
            name: 'selection_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'product_id',
            referencedColumnName: 'id'
        }
    })
    products: Product[];
}
