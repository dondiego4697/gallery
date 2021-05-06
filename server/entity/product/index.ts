import {nanoid} from 'nanoid';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

import {Author} from 'entity/author';
import {Category} from 'entity/category';
import {Color} from 'entity/color';
import {DbTable} from 'entity/const';
import {Gallery} from 'entity/gallery';
import {Material} from 'entity/material';
import {ProductPhoto} from 'entity/product-photo';
import {Selection} from 'entity/selection';
import {ShapeFormat} from 'entity/shape-format';
import {Style} from 'entity/style';
import {Tag} from 'entity/tag';

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
    categoryId: number;

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @Column({type: 'bigint', nullable: true})
    galleryId: number;

    @ManyToOne(() => Gallery, (gallery) => gallery.products)
    gallery: Gallery;

    @Column({type: 'bigint', nullable: true})
    styleId: number;

    @ManyToOne(() => Style, (style) => style.products)
    style: Style;

    @Column({type: 'bigint', nullable: true})
    materialId: number;

    @ManyToOne(() => Material, (material) => material.products)
    material: Material;

    @Column({type: 'bigint', nullable: true})
    shapeFormatId: number;

    @ManyToOne(() => ShapeFormat, (shapeFormat) => shapeFormat.products)
    shapeFormat: ShapeFormat;

    @OneToMany(() => ProductPhoto, (productPhoto) => productPhoto.product)
    photos: ProductPhoto[];

    @ManyToMany(() => Tag)
    @JoinTable({
        name: DbTable.PRODUCT_TAG,
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id'
        }
    })
    tags: Tag[];

    @ManyToMany(() => Color)
    @JoinTable({
        name: DbTable.PRODUCT_COLOR,
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'color_id',
            referencedColumnName: 'id'
        }
    })
    colors: Color[];

    @ManyToMany(() => Selection)
    @JoinTable({
        name: DbTable.PRODUCT_SELECTION,
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'selection_id',
            referencedColumnName: 'id'
        }
    })
    selections: Selection[];
}
