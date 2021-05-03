import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {nanoid} from 'nanoid';

@Entity()
export class Interior {
    @BeforeInsert()
    _beforeInsert() {
        this.code = this.code || nanoid();
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    photoUrl: string;

    @Column({type: 'integer'})
    x: number;

    @Column({type: 'integer'})
    y: number;

    @Column({type: 'integer'})
    maxPictureHeightPercent: number;

    @Column({type: 'integer'})
    maxPictureWidthPercent: number;
}
