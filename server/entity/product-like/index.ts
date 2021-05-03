import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ProductLike {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    productId: number;

    @Column({type: 'bigint'})
    userId: number;
}
