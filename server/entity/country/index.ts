import {Column, OneToMany, Entity, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import {nanoid} from 'nanoid';
import {City} from 'entity/city';

@Entity()
export class Country {
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

    @OneToMany(() => City, (city) => city.country)
    cities: City[];
}
