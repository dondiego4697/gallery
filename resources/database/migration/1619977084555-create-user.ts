import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1619977084555 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users ( 
                id BIGSERIAL NOT NULL,  
            
                email TEXT NOT NULL,
                code INTEGER,
                is_admin BOOLEAN NOT NULL DEFAULT FALSE,
            
                created_at TIMESTAMP WITH TIME ZONE DEFAULT clock_timestamp() NOT NULL,
            
                CONSTRAINT pk__users PRIMARY KEY (id)
            );
            
            CREATE UNIQUE INDEX idx__users__email ON users (LOWER(email));
            
            CREATE TABLE product_like (   
                id BIGSERIAL NOT NULL,
            
                user_id BIGINT NOT NULL,
                product_id BIGINT NOT NULL,
            
                CONSTRAINT pk__product_like PRIMARY KEY (id),
            
                CONSTRAINT fk__product_like__user_id__user FOREIGN KEY (user_id) REFERENCES users (id),
                CONSTRAINT fk__product_like__product_id__product FOREIGN KEY (product_id) REFERENCES product (id)
            );

            CREATE INDEX idx__product_like__user_id ON product_like USING btree (user_id);
            CREATE INDEX idx__product_like__product_id ON product_like USING btree (product_id);

            CREATE TABLE product_view (
                id BIGSERIAL NOT NULL,  

                product_id BIGINT NOT NULL,
                fingerprint TEXT NOT NULL,
        
                CONSTRAINT pk__product_view PRIMARY KEY (id),

                CONSTRAINT uq__product_view__product_id__fingerprint UNIQUE (product_id, fingerprint),

                CONSTRAINT fk__product_view__product_id__product FOREIGN KEY (product_id) REFERENCES product (id)
            );

            CREATE INDEX idx__product_view__product_id ON product_view USING btree (product_id);

            CREATE VIEW view__product_view AS (
                SELECT prv.product_id, COUNT(*) as count
                FROM product_view prv
                INNER JOIN product pr ON pr.id = prv.product_id
                WHERE pr.is_sold IS FALSE
                GROUP BY (product_id)
            );

            CREATE VIEW view__product_like AS (
                SELECT prl.product_id, COUNT(*) as count
                FROM product_like prl
                INNER JOIN product pr ON pr.id = prl.product_id
                WHERE pr.is_sold IS FALSE
                GROUP BY (product_id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP VIEW view__product_view;
            DROP TABLE product_view;
            DROP TABLE product_like;
            DROP TABLE users;
        `);
    }

}
