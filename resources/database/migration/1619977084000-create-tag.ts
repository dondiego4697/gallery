import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1619977084000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`            
            CREATE TABLE tag (   
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,
            
                name TEXT NOT NULL,
            
                CONSTRAINT pk__tag PRIMARY KEY (id),
            
                CONSTRAINT uq__tag__code UNIQUE (code),
                CONSTRAINT uq__tag__name UNIQUE (name)
            );
            
            CREATE INDEX idx__tag__code ON tag USING btree (code);
            
            CREATE TABLE product_tag (   
                id BIGSERIAL NOT NULL,
            
                tag_id BIGINT NOT NULL,
                product_id BIGINT NOT NULL,
            
                CONSTRAINT pk__product_tag PRIMARY KEY (id),
            
                CONSTRAINT fk__product_tag__tag_id__tag FOREIGN KEY (tag_id) REFERENCES tag (id),
                CONSTRAINT fk__product_tag__product_id__product FOREIGN KEY (product_id) REFERENCES product (id)
            );
            
            CREATE INDEX idx__product_tag__tag_id ON product_tag USING btree (tag_id);
            CREATE INDEX idx__product_tag__product_id ON product_tag USING btree (product_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE tag;
            DROP TABLE product_tag;
        `);
    }

}
