import {Column, OneToMany, Entity, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import slugify from 'slugify';
import {Product} from 'entity/product';

@Entity()
export class Gallery {
    @BeforeInsert()
    _beforeInsert() {
        this.code = slugify(this.name, '_');
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;

    @OneToMany(() => Product, (product) => product.gallery)
    products: Product[];
}
