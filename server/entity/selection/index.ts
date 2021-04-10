import {DbTable} from 'entity/const';
import {Picture} from 'entity/picture';
import {Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Selection {
    @PrimaryGeneratedColumn({type: 'bigint'})
    id: number;

    @Column({type: 'text'})
    name: string;

    @Column({type: 'text', nullable: true})
    description?: string;

    @Column({type: 'text'})
    imageUrl: string;

    @Column({type: 'boolean'})
    isShow: boolean;

    @Column({type: 'timestamp with time zone'})
    createdAt: Date;

    @ManyToMany(() => Picture)
    @JoinTable({
        name: DbTable.SELECTION_PICTURE,
        joinColumn: {
            name: 'selection_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'picture_id',
            referencedColumnName: 'id'
        }
    })
    pictures: Picture[];
}