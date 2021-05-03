import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class AuthorProfession {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    authorId: number;

    @Column({type: 'bigint'})
    professionId: number;
}
