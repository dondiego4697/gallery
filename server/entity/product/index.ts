import {Column, OneToMany, ManyToOne, Entity, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import {nanoid} from 'nanoid';
import {Author} from 'entity/author';
import {ProductCategory} from 'entity/product-category';
import {ProductPhoto} from 'entity/product-photo';

interface ProductSize {
    width: number;
    height: number;
    length?: number;
}

@Entity()
export class Product {
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

    @Column({type: 'jsonb'})
    size: ProductSize;

    @Column({type: 'jsonb'})
    data: unknown;

    @Column({type: 'numeric'})
    price: number;

    @Column({type: 'boolean'})
    isSold: boolean;

    @Column({type: 'timestamp with time zone'})
    createdAt: Date;

    @Column({type: 'bigint'})
    authorId: number;

    @ManyToOne(() => Author, (author) => author.products)
    author: Author;

    @Column({type: 'bigint'})
    productCategoryId: number;

    @ManyToOne(() => ProductCategory, (category) => category.products)
    productCategory: ProductCategory;

    @Column({type: 'text', nullable: true})
    style: string;

    @Column({type: 'text', nullable: true})
    material: string;

    @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product)
    photos: ProductPhoto[];
}
