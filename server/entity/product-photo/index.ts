import {Product} from 'entity/product';
import {Column, ManyToOne, Entity, PrimaryGeneratedColumn} from 'typeorm';

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
