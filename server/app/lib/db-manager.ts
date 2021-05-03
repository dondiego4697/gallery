import {toFinite} from 'lodash';
import {types as pgTypes} from 'pg';
import typeorm, {createConnection} from 'typeorm';
import {config} from 'app/config';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {Author} from 'entity/author';
import {City} from 'entity/city';
import {Country} from 'entity/country';
import {AuthorProfession} from 'entity/author-profession';
import {Interior} from 'entity/interior';
import {Product} from 'entity/product';
import {ProductCategory} from 'entity/product-category';
import {ProductLike} from 'entity/product-like';
import {ProductPhoto} from 'entity/product-photo';
import {ProductTag} from 'entity/product-tag';
import {ProductView} from 'entity/product-view';
import {Profession} from 'entity/profession';
import {Selection} from 'entity/selection';
import {ProductSelection} from 'entity/product-selection';
import {Tag} from 'entity/tag';
import {User} from 'entity/user';
import {ViewOfProductView} from 'entity/view-of-product-view';
import {ViewOfProductFilters} from 'entity/view-of-product-filters';

pgTypes.setTypeParser(20, toFinite);
pgTypes.setTypeParser(1700, toFinite);

class DbManager {
    protected connection: typeorm.Connection;
    protected connectionDeffered: Promise<typeorm.Connection>;

    constructor() {
        this.connectionDeffered = createConnection({
            type: 'postgres',
            replication: {
                master: {
                    host: config.db.hosts[0],
                    port: config.db.port,
                    username: config.db.username,
                    password: config.db.password,
                    database: config.db.database
                },
                slaves: config.db.hosts.slice(1).map((host) => ({
                    host,
                    port: config.db.port,
                    username: config.db.username,
                    password: config.db.password,
                    database: config.db.database
                }))
            },
            entities: [
                City,
                Country,
                Author,
                AuthorProfession,
                Interior,
                Product,
                ProductCategory,
                ProductLike,
                ProductSelection,
                ProductPhoto,
                ProductTag,
                ProductView,
                Profession,
                Selection,
                Tag,
                User,
                ViewOfProductView,
                ViewOfProductFilters
            ],
            logging: config['logger.silent'] ? false : config['logger.db.level'],
            maxQueryExecutionTime: 5000,
            namingStrategy: new SnakeNamingStrategy(),
            extra: {
                connectionLimit: 500
            }
        });

        this.connectionDeffered.then((connection) => {
            this.connection = connection;
        });
    }

    public async getConnection() {
        await this.connectionDeffered;

        if (!this.connection.isConnected) {
            this.connection.connect();
        }

        return this.connection;
    }
}

export const dbManager = new DbManager();
