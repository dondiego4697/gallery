import {Column, OneToMany, Entity, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import {nanoid} from 'nanoid';
import {Product} from 'entity/product';

@Entity()
export class ProductCategory {
    @BeforeInsert()
    _beforeInsert() {
        this.code = this.code || nanoid();
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;

    @OneToMany(() => Product, (product) => product.productCategory)
    products: Product[];
}
