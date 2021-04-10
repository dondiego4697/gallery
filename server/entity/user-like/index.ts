import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class UserLike {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    pictureId: number;

    @Column({type: 'bigint'})
    userId: number;
}
