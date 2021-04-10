import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Interior {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    photoUrl: string;

    @Column({type: 'integer'})
    x: number;

    @Column({type: 'integer'})
    y: number;

    @Column({type: 'integer'})
    maxPictureHeight: number;

    @Column({type: 'integer'})
    maxPictureWidth: number;
}
