import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

import {Product} from 'entity/product';

@Entity()
export class ProductPhoto {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    productId: number;

    @Column({type: 'text'})
    photoUrl: string;

    @ManyToOne(() => Product, (product) => product.photos)
    product: Product;
}
