import {nanoid} from 'nanoid';
import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

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
    maxPictureHeight: number;

    @Column({type: 'integer'})
    maxPictureWidth: number;
}
