import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactoring1619976980721 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE category (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                name TEXT NOT NULL,

                CONSTRAINT pk__category PRIMARY KEY (id),

                CONSTRAINT uk__category__code UNIQUE (code)
            );

            CREATE INDEX idx__category__code ON category USING btree (code);

            CREATE TABLE color (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,
                
                hex TEXT NOT NULL,
                name TEXT NOT NULL,

                CONSTRAINT pk__color PRIMARY KEY (id),

                CONSTRAINT uk__color__code UNIQUE (code),
                CONSTRAINT uk__color__hex UNIQUE (hex)
            );

            CREATE INDEX idx__color__code ON color USING btree (code);

            CREATE TABLE style (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                name TEXT NOT NULL,

                CONSTRAINT pk__style PRIMARY KEY (id),

                CONSTRAINT uk__style__code UNIQUE (code)
            );

            CREATE INDEX idx__style__code ON style USING btree (code);

            CREATE TABLE material (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                name TEXT NOT NULL,

                CONSTRAINT pk__material PRIMARY KEY (id),

                CONSTRAINT uk__material__code UNIQUE (code)
            );

            CREATE INDEX idx__material__code ON material USING btree (code);

            CREATE TABLE shape_format (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                name TEXT NOT NULL,

                CONSTRAINT pk__shape_format PRIMARY KEY (id),

                CONSTRAINT uk__shape_format__code UNIQUE (code)
            );

            CREATE INDEX idx__shape_format__code ON shape_format USING btree (code);

            CREATE TABLE product (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                author_id BIGINT NOT NULL,
                category_id BIGINT NOT NULL,
                gallery_id BIGINT,

                style_id BIGINT,
                material_id BIGINT,
                shape_format_id BIGINT,

                name TEXT NOT NULL,

                size JSONB NOT NULL DEFAULT '{}',
                data JSONB NOT NULL DEFAULT '{}',
                price NUMERIC(9, 2) NOT NULL,

                is_sold BOOLEAN NOT NULL DEFAULT FALSE,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

                CONSTRAINT pk__product PRIMARY KEY (id),

                CONSTRAINT fk__product__gallery_id__gallery FOREIGN KEY (gallery_id) REFERENCES gallery (id),
                CONSTRAINT fk__product__author_id__author FOREIGN KEY (author_id) REFERENCES author (id),
                CONSTRAINT fk__product__category_id__category FOREIGN KEY (category_id) REFERENCES category (id),
                CONSTRAINT fk__product__style_id__style FOREIGN KEY (style_id) REFERENCES style (id),
                CONSTRAINT fk__product__material_id__material FOREIGN KEY (material_id) REFERENCES material (id),
                CONSTRAINT fk__product__shape_format_id__shape_format FOREIGN KEY (shape_format_id) REFERENCES shape_format (id),

                CONSTRAINT uq__product__code UNIQUE (code)
            );

            CREATE INDEX idx__product__code ON product USING btree (code);

            CREATE TABLE product_color (
                id BIGSERIAL NOT NULL,
            
                product_id BIGINT NOT NULL,
                color_id BIGINT NOT NULL,
            
                CONSTRAINT pk__product_color PRIMARY KEY (id),
            
                CONSTRAINT uq__product_color__product_id__color_id UNIQUE (product_id, color_id),
            
                CONSTRAINT fk__product_color__product_id__product FOREIGN KEY (product_id) REFERENCES product (id),
                CONSTRAINT fk__product_color__color_id__color FOREIGN KEY (color_id) REFERENCES color (id)
            );

            CREATE TABLE product_photo (  
                id BIGSERIAL NOT NULL,
            
                product_id BIGINT NOT NULL,
                photo_url TEXT NOT NULL,
            
                CONSTRAINT pk__product_photo PRIMARY KEY (id),
            
                CONSTRAINT uq__product_photo__product_id__photo_url UNIQUE (product_id, photo_url),
            
                CONSTRAINT fk__product_photo__product_id__product FOREIGN KEY (product_id) REFERENCES product (id)
            );

            CREATE VIEW view__product_filters AS (
                SELECT
                    'material' as type,
                    ct.code as category_code,
                    m.code as code,
                    m.name as name
                FROM product pr
                    INNER JOIN category ct on ct.id = pr.category_id
                    LEFT JOIN material m ON m.id = pr.material_id
                    WHERE m IS NOT NULL
                GROUP BY (ct.id, m.id)
                UNION (
                    SELECT
                        'style' as type,
                        ct.code as category_code,
                        st.code as code,
                        st.name as name
                    FROM product pr
                        INNER JOIN category ct on ct.id = pr.category_id
                        LEFT JOIN style st ON st.id = pr.style_id
                        WHERE st IS NOT NULL
                    GROUP BY (ct.id, st.id)
                )
                UNION (
                    SELECT
                        'shapeFormat' as type,
                        ct.code as category_code,
                        sf.code as code,
                        sf.name as name
                    FROM product pr
                        INNER JOIN category ct on ct.id = pr.category_id
                        LEFT JOIN shape_format sf ON sf.id = pr.shape_format_id
                        WHERE sf IS NOT NULL
                    GROUP BY (ct.id, sf.id)
                )
                UNION (
                    SELECT
                        'color' as type,
                        ct.code as category_code,
                        clr.code as code,
                        clr.name as name
                    FROM product pr
                        INNER JOIN category ct on ct.id = pr.category_id
                        LEFT JOIN product_color pc on pr.id = pc.product_id
                        LEFT JOIN color clr ON clr.id = pc.color_id
                        WHERE clr IS NOT NULL
                    GROUP BY (ct.id, clr.id)
                )
            );

            CREATE VIEW view__product_min_max AS (
                SELECT
                    max(price) as max_price,
                    min(price) as min_price,
                    max(size ->> 'width')::int as max_width,
                    min(size ->> 'width')::int as min_width,
                    max(size ->> 'height')::int as max_height,
                    min(size ->> 'height')::int as min_height,
                    max(size ->> 'length')::int as max_length,
                    min(size ->> 'length')::int as min_length
                FROM product
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
