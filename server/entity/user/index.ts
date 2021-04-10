import {DbTable} from 'entity/const';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: DbTable.USER})
export class User {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    email: string;
}
