import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class SelectionPicture {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    pictureId: number;

    @Column({type: 'bigint'})
    selectionId: number;
}
