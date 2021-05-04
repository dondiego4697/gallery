import {Column, Entity, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import slugify from 'slugify';

@Entity()
export class Color {
    @BeforeInsert()
    _beforeInsert() {
        this.code = slugify(this.name.toLowerCase(), '_');
    }

    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'text'})
    hex: string;
}
