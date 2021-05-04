import {Column, OneToMany, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {City} from 'entity/city';

@Entity()
export class Country {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    code: string;

    @Column({type: 'text'})
    name: string;

    @OneToMany(() => City, (city) => city.country)
    cities: City[];
}
