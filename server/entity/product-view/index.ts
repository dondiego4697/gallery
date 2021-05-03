import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ProductView {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    productId: number;

    @Column({type: 'text'})
    fingerprint: string;
}
