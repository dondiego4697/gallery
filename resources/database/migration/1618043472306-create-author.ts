import {MigrationInterface, QueryRunner} from 'typeorm';

export class PostRefactoring1618043472306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE gallery (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,

                CONSTRAINT pk__gallery PRIMARY KEY (id),

                CONSTRAINT uq__gallery__code UNIQUE (code),
                CONSTRAINT uq__gallery__name UNIQUE (name)
            );

            CREATE TABLE country (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,

                CONSTRAINT pk__country PRIMARY KEY (id),

                CONSTRAINT uq__country__code UNIQUE (code),
                CONSTRAINT uq__country__name UNIQUE (name)
            );

            CREATE TABLE city (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,
                name TEXT NOT NULL,

                country_id BIGINT NOT NULL,

                CONSTRAINT pk__city PRIMARY KEY (id),

                CONSTRAINT uq__city__code UNIQUE (code),
                CONSTRAINT uq__city__name UNIQUE (name),

                CONSTRAINT fk__city__country_id__country FOREIGN KEY (country_id) REFERENCES country (id)
            );

            CREATE TABLE profession (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                name TEXT NOT NULL,

                CONSTRAINT pk__profession PRIMARY KEY (id),

                CONSTRAINT uq__profession__code UNIQUE (code),
                CONSTRAINT uq__profession__name UNIQUE (name)
            );

            CREATE INDEX idx__profession__code ON profession USING btree (code);

            CREATE TABLE author (
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,

                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,

                avatar_url TEXT,
                bio TEXT,

                city_id BIGINT,

                created_at TIMESTAMP WITH TIME ZONE DEFAULT clock_timestamp() NOT NULL,

                CONSTRAINT pk__author PRIMARY KEY (id),

                CONSTRAINT uk__author__code UNIQUE (code),

                CONSTRAINT fk__author__city_id__city FOREIGN KEY (city_id) REFERENCES city (id)
            );

            CREATE INDEX idx__author__code ON author USING btree (code);

            CREATE TABLE author_profession (
                id BIGSERIAL NOT NULL,

                author_id BIGINT NOT NULL,
                profession_id BIGINT NOT NULL,

                CONSTRAINT pk__author_profession PRIMARY KEY (id),

                CONSTRAINT fk__author_profession__author_id__author FOREIGN KEY (author_id) REFERENCES author (id),
                CONSTRAINT fk__author_profession__profession_id__profession FOREIGN KEY (profession_id) REFERENCES profession (id),

                CONSTRAINT uq__author_profession__author_id__profession_id UNIQUE (author_id, profession_id)
            );

            CREATE TABLE interior ( 
                id BIGSERIAL NOT NULL,
                code TEXT NOT NULL,
          
                photo_url TEXT NOT NULL,

                x INTEGER NOT NULL,
                y INTEGER NOT NULL,

                max_picture_height_percent INTEGER NOT NULL,
                max_picture_width_percent INTEGER NOT NULL,
        
                CONSTRAINT uq__interior__photo_url UNIQUE (photo_url),
                CONSTRAINT uq__interior__code UNIQUE (code),

                CONSTRAINT check__interior__percent CHECK (max_picture_height_percent > 0 AND max_picture_height_percent <= 100 AND max_picture_width_percent > 0 AND max_picture_width_percent <= 100)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE interior;
            DROP TABLE author_profession;
            DROP TABLE author;
            DROP TABLE profession;
        `);
    }

}
