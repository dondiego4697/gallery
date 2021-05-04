import {Column, OneToMany, Entity, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import slugify from 'slugify';
import {Product} from 'entity/product';

@Entity()
export class Style {
    @BeforeInsert()
    _beforeInsert() {
        this.code = slugify(this.name.toLowerCase(), '_');
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;

    @OneToMany(() => Product, (product) => product.style)
    products: Product[];
}
