import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ProductSelection {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    productId: number;

    @Column({type: 'bigint'})
    selectionId: number;
}
