import {MigrationInterface, QueryRunner} from 'typeorm';

export class PostRefactoring1619977381317 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE selection ( 
                id BIGSERIAL NOT NULL, 
                code TEXT NOT NULL,
            
                name TEXT NOT NULL,
                description TEXT,
                image_url TEXT NOT NULL,
            
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
            
                parent_id BIGINT,
                path LTREE NOT NULL,
            
                level INTEGER GENERATED ALWAYS AS (nlevel(path)) STORED,
                is_root BOOLEAN NOT NULL GENERATED ALWAYS AS (nlevel(path) = 1) STORED,
            
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            
                CONSTRAINT pk__selection PRIMARY KEY (id),
            
                CONSTRAINT uq__selection__code UNIQUE (code),
                CONSTRAINT uq__selection__path UNIQUE (path),
            
                CONSTRAINT fk__selection__parent_id__selection FOREIGN KEY (parent_id) REFERENCES selection (id),
            
                CONSTRAINT check__selection__max_level CHECK (level > 0 AND level <= 2),
                CONSTRAINT check__selection__parent_id_and_root CHECK ((is_root IS TRUE AND parent_id IS NULL) OR (is_root IS FALSE AND parent_id IS NOT NULL))
            );
            
            CREATE INDEX idx__selection__code ON selection USING btree (code);
            
            CREATE OR REPLACE FUNCTION selection__generate_path()
                RETURNS TRIGGER AS $$
                DECLARE
                    _parent_path LTREE;
                BEGIN
                    IF TG_OP = 'UPDATE' THEN
                        IF NEW.parent_id <> OLD.parent_id THEN
                            RAISE EXCEPTION 'CHANGING_PARENT_IS_FORBIDDEN';
                        END IF;
            
                        RETURN NEW;
                    END IF;
            
                    IF TG_OP = 'INSERT' THEN
                        IF NEW.parent_id IS NULL THEN
                            NEW.path = text2ltree(NEW.id::text);
                        ELSE
                            SELECT path INTO _parent_path FROM selection WHERE id = NEW.parent_id;
                            NEW.path = _parent_path || NEW.id::text;
                        END IF;
                    END IF;
            
                    RETURN NEW;
                END;
                $$ language 'plpgsql';
            
            CREATE TRIGGER
                trigger__selection__generate_path
            BEFORE INSERT OR UPDATE ON
                selection
            FOR EACH ROW
            EXECUTE PROCEDURE
                selection__generate_path();

            CREATE OR REPLACE FUNCTION selection__check_constraints()
            RETURNS TRIGGER AS $$
            DECLARE
                _product_count BIGINT;
            BEGIN        
                IF TG_OP = 'INSERT' THEN
                    IF NEW.parent_id IS NOT NULL THEN
                        SELECT COUNT(*) INTO _product_count FROM product_selection WHERE selection_id = NEW.parent_id;

                        IF _product_count > 0 THEN
                            RAISE EXCEPTION 'SELECTION_ALREADY_HAS_PRODUCTS_IN_PARENT';
                        END IF;
                    END IF;
                END IF;
        
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            CREATE TRIGGER
                trigger__selection__check_constraints
            BEFORE INSERT OR UPDATE ON
                selection
            FOR EACH ROW
            EXECUTE PROCEDURE
                selection__check_constraints();
            
            CREATE TABLE product_selection (  
                id BIGSERIAL NOT NULL,
            
                selection_id BIGINT NOT NULL,
                product_id BIGINT NOT NULL,
            
                CONSTRAINT pk__product_selection PRIMARY KEY (id),
            
                CONSTRAINT fk__product_selection__selection_id__selection FOREIGN KEY (selection_id) REFERENCES selection (id),
                CONSTRAINT fk__product_selection__product_id__product FOREIGN KEY (product_id) REFERENCES product (id),
            
                CONSTRAINT uq__product_selection__product_id__selection_id UNIQUE (product_id, selection_id)
            );
            
            CREATE OR REPLACE FUNCTION product_selection__check_constraints()
                RETURNS TRIGGER AS $$
                DECLARE
                    _level INTEGER;
                    _path LTREE;
                    _child_count BIGINT;
                BEGIN
                    SELECT level INTO _level FROM selection WHERE id = NEW.selection_id;
                    SELECT path INTO _path FROM selection WHERE id = NEW.selection_id;

                    -- Если есть дочерние листы, то только на дочерние листы устанавливаем продукты
                    IF _level = 1 THEN
                        SELECT COUNT(*) INTO _child_count
                        FROM selection
                        WHERE TRUE
                            AND path ~ (ltree2text(_path) || '.*')::lquery
                            AND path != _path;

                        IF _child_count > 0 THEN
                            RAISE EXCEPTION 'PRODUCT_CAN_BE_ATTACHED_TO_ROOT_WITH_LEAF';
                        END IF;
                    END IF;
            
                    RETURN NEW;
                END;
                $$ language 'plpgsql';
            
            CREATE TRIGGER
                trigger__product_selection__check_constraints
            BEFORE INSERT OR UPDATE ON
                product_selection
            FOR EACH ROW
            EXECUTE PROCEDURE
                product_selection__check_constraints();
        `);
    }   

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE selection_product;
            DROP TABLE selection;
        
            DROP FUNCTION selection__generate_path;
            DROP FUNCTION product_selection__check_only_selection_leaf;
        `);

    }

}
