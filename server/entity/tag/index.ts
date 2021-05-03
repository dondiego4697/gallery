import {Column, Entity, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import {nanoid} from 'nanoid';

@Entity()
export class Tag {
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
}
