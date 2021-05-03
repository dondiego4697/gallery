import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ProductTag {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    productId: number;

    @Column({type: 'bigint'})
    tagId: number;
}
