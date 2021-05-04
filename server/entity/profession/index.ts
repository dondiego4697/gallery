import slugify from 'slugify';
import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Profession {
    @BeforeInsert()
    _beforeInsert() {
        this.code = slugify(this.name, '_');
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;
}
