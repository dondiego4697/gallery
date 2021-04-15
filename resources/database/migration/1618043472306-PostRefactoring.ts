import {MigrationInterface, QueryRunner} from 'typeorm';

export class PostRefactoring1618043472306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE author (
                id BIGSERIAL NOT NULL,
                public_id TEXT NOT NULL,

                name TEXT NOT NULL,
                avatar_url TEXT,
                bio TEXT,

                is_gallery BOOLEAN NOT NULL DEFAULT FALSE,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

                CONSTRAINT pk__author PRIMARY KEY (id),
                CONSTRAINT uk__author__public_id UNIQUE (public_id)
            );

            CREATE INDEX idx__author__public_id ON author USING btree (public_id);

            CREATE TABLE picture_shape (
                id SMALLSERIAL NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,

                CONSTRAINT pk__picture_shape PRIMARY KEY (id),
                CONSTRAINT uq__picture_shape__code UNIQUE (code),
                CONSTRAINT uq__picture_shape__name UNIQUE (name)

            );

            CREATE TABLE picture_style (
                id SMALLSERIAL NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,

                CONSTRAINT pk__picture_style PRIMARY KEY (id),
                CONSTRAINT uq__picture_style__code UNIQUE (code),
                CONSTRAINT uq__picture_style__name UNIQUE (name)
            );

            CREATE TABLE picture (
                id BIGSERIAL NOT NULL,
                public_id TEXT NOT NULL,
                
                name TEXT NOT NULL,

                width INTEGER NOT NULL,
                height INTEGER NOT NULL,
                
                shape_id SMALLINT NOT NULL,
                style_id SMALLINT NOT NULL,

                author_id BIGINT NOT NULL,

                is_sold BOOLEAN NOT NULL DEFAULT FALSE,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        
                CONSTRAINT pk__picture PRIMARY KEY (id),
                CONSTRAINT fk__picture__author_id__author FOREIGN KEY (author_id) REFERENCES author (id),
                CONSTRAINT fk__picture__shape_id__picture_shape FOREIGN KEY (shape_id) REFERENCES picture_shape (id),
                CONSTRAINT fk__picture__style_id__picture_style FOREIGN KEY (style_id) REFERENCES picture_style (id),
                CONSTRAINT uk__picture__public_id UNIQUE (public_id)
            );

            CREATE INDEX idx__picture__public_id ON picture USING btree (public_id);

            CREATE TABLE picture_view (
                id BIGSERIAL NOT NULL,  

                picture_id BIGINT NOT NULL,
                fingerprint TEXT NOT NULL,
        
                CONSTRAINT pk__picture_view PRIMARY KEY (id),
                CONSTRAINT uq__picture_view__picture_id__fingerprint UNIQUE (picture_id, fingerprint),
                CONSTRAINT fk__picture_view__picture_id__picture FOREIGN KEY (picture_id) REFERENCES picture (id)
            );

            CREATE VIEW view__picture_view AS SELECT picture_id, COUNT(*) as count FROM picture_view GROUP BY (picture_id);

            CREATE TABLE picture_photo (  
                id BIGSERIAL NOT NULL,

                picture_id BIGINT NOT NULL,
                photo_url TEXT NOT NULL,
        
                CONSTRAINT pk__picture_photo PRIMARY KEY (id),
                CONSTRAINT uq__picture_photo__picture_id__photo_url UNIQUE (picture_id, photo_url),
                CONSTRAINT fk__picture_photo__picture_id__picture FOREIGN KEY (picture_id) REFERENCES picture (id)
            );

            CREATE TABLE interior ( 
                id BIGSERIAL NOT NULL,  
          
                photo_url TEXT NOT NULL,

                x INTEGER NOT NULL,
                y INTEGER NOT NULL,

                max_picture_height INTEGER NOT NULL,
                max_picture_width INTEGER NOT NULL,
        
                CONSTRAINT uq__interior__photo_url UNIQUE (photo_url)
            );

            CREATE TABLE selection ( 
                id BIGSERIAL NOT NULL, 
                public_id TEXT NOT NULL,
          
                name TEXT NOT NULL,
                description TEXT,
                image_url TEXT NOT NULL,

                is_show BOOLEAN NOT NULL DEFAULT TRUE,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        
                CONSTRAINT pk__selection PRIMARY KEY (id),
                CONSTRAINT uk__selection__public_id UNIQUE (public_id)
            );

            CREATE INDEX idx__selection__public_id ON selection USING btree (public_id);
            CREATE UNIQUE INDEX idx__selection__name__is_show ON selection (LOWER(name), is_show);  

            CREATE TABLE selection_picture (  
                id BIGSERIAL NOT NULL,

                selection_id BIGINT NOT NULL,
                picture_id BIGINT NOT NULL,
        
                CONSTRAINT pk__selection_picture PRIMARY KEY (id),
                CONSTRAINT fk__selection_picture__selection_id__selection FOREIGN KEY (selection_id) REFERENCES selection (id),
                CONSTRAINT fk__selection_picture__picture_id__picture FOREIGN KEY (picture_id) REFERENCES picture (id),
                CONSTRAINT uq__selection_picture__picture_id__selection_id UNIQUE (picture_id, selection_id)
            );

            CREATE TABLE users ( 
                id BIGSERIAL NOT NULL,  
          
                email TEXT NOT NULL,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
        
                CONSTRAINT pk__users PRIMARY KEY (id)
            );

            CREATE UNIQUE INDEX idx__users__email ON users (LOWER(email));

            CREATE TABLE user_like (   
                id BIGSERIAL NOT NULL,

                user_id BIGINT NOT NULL,
                picture_id BIGINT NOT NULL,

                CONSTRAINT pk__user_like PRIMARY KEY (id),
                CONSTRAINT fk__user_like__user_id__user FOREIGN KEY (user_id) REFERENCES users (id),
                CONSTRAINT fk__user_like__picture_id__picture FOREIGN KEY (picture_id) REFERENCES picture (id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE user_like;
            
            DROP INDEX idx__users__email;
            DROP TABLE users;

            DROP TABLE selection_picture;

            DROP INDEX idx__selection__public_id;
            DROP INDEX idx__selection__name__is_show;
            DROP TABLE selection;

            DROP TABLE interior;
            DROP TABLE picture_photo;

            DROP VIEW view__picture_view;
            DROP TABLE picture_view;

            DROP INDEX idx__picture__public_id;
            DROP INDEX idx__picture__name;
            DROP TABLE picture;

            DROP TABLE picture_shape;
            DROP TABLE picture_style;

            DROP INDEX idx__author__public_id;
            DROP TABLE author;
        `);
    }

}
