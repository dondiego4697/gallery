import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactoring1619976980721 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE product_category (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                name TEXT NOT NULL,

                CONSTRAINT pk__product_category PRIMARY KEY (id),

                CONSTRAINT uk__product_category__code UNIQUE (code)
            );

            CREATE INDEX idx__product_category__code ON product_category USING btree (code);

            CREATE TABLE product (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                author_id BIGINT NOT NULL,
                product_category_id BIGINT NOT NULL,

                name TEXT NOT NULL,

                style TEXT,
                material TEXT,      
                shape_format TEXT,

                size JSONB NOT NULL DEFAULT '{}',
                data JSONB NOT NULL DEFAULT '{}',
                price NUMERIC(9, 2) NOT NULL,

                is_sold BOOLEAN NOT NULL DEFAULT FALSE,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

                CONSTRAINT pk__product PRIMARY KEY (id),

                CONSTRAINT fk__product__author_id__author FOREIGN KEY (author_id) REFERENCES author (id),
                CONSTRAINT fk__product__product_category_id__category FOREIGN KEY (product_category_id) REFERENCES product_category (id),

                CONSTRAINT uq__product__code UNIQUE (code)
            );

            CREATE INDEX idx__product__code ON product USING btree (code);

            CREATE TABLE product_photo (  
                id BIGSERIAL NOT NULL,
            
                product_id BIGINT NOT NULL,
                photo_url TEXT NOT NULL,
            
                CONSTRAINT pk__product_photo PRIMARY KEY (id),
            
                CONSTRAINT uq__product_photo__product_id__photo_url UNIQUE (product_id, photo_url),
            
                CONSTRAINT fk__product_photo__product_id__product FOREIGN KEY (product_id) REFERENCES product (id)
            );

            CREATE VIEW view__product_filters AS (
                SELECT * FROM (
                    SELECT
                        pc.id as product_category_id,
                        pc.code as product_category_code,
                        style   as value,
                        'style' as type
                    FROM product
                        INNER JOIN product_category pc on pc.id = product.product_category_id
                    UNION
                    (
                        SELECT pc.id as product_category_id,
                            pc.code as product_category_code,
                            material   as value,
                            'material' as type
                        FROM product
                            INNER JOIN product_category pc on pc.id = product.product_category_id
                    )
                    UNION
                    (
                        SELECT pc.id as product_category_id,
                            pc.code as product_category_code,
                            shape_format  as value,
                            'shapeFormat' as type
                        FROM product
                            INNER JOIN product_category pc on pc.id = product.product_category_id
                    )
                ) as foo
                GROUP BY (type, value, product_category_id, product_category_code)
            );
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE product_photo;
            DROP TABLE product;
            DROP TABLE product_category;
        `);
    }

}
