import {Column, Entity, ManyToOne, OneToMany, BeforeInsert, PrimaryGeneratedColumn} from 'typeorm';
import {nanoid} from 'nanoid';
import {Author} from 'entity/author';
import {Country} from 'entity/country';

@Entity()
export class City {
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

    @Column({type: 'bigint'})
    countryId: number;

    @ManyToOne(() => Country, (country) => country.cities)
    country: Country;

    @OneToMany(() => Author, (author) => author.city)
    authors: Author[];
}
