import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PictureLike {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    pictureId: number;

    @Column({type: 'bigint'})
    userId: number;
}
