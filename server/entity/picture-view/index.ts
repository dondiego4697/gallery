import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class PictureView {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'bigint'})
    pictureId: number;

    @Column({type: 'text'})
    fingerprint: string;
}
