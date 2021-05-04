import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ProductColor {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    productId: number;

    @Column({type: 'bigint'})
    colorId: number;
}
