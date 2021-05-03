import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {nanoid} from 'nanoid';

@Entity()
export class Profession {
    @BeforeInsert()
    _beforeInsert() {
        this.code = nanoid();
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;
}
