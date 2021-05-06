import slugify from 'slugify';
import {BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';

import {Author} from 'entity/author';
import {Country} from 'entity/country';

@Entity()
export class City {
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

    @Column({type: 'bigint'})
    countryId: number;

    @ManyToOne(() => Country, (country) => country.cities)
    country: Country;

    @OneToMany(() => Author, (author) => author.city)
    authors: Author[];
}
