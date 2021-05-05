import {toFinite} from 'lodash';
import {types as pgTypes} from 'pg';
import typeorm, {createConnection} from 'typeorm';
import {config} from 'app/config';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {Author} from 'entity/author';
import {City} from 'entity/city';
import {Gallery} from 'entity/gallery';
import {Color} from 'entity/color';
import {Country} from 'entity/country';
import {AuthorProfession} from 'entity/author-profession';
import {Interior} from 'entity/interior';
import {Product} from 'entity/product';
import {Category} from 'entity/category';
import {ProductLike} from 'entity/product-like';
import {Style} from 'entity/style';
import {Material} from 'entity/material';
import {ShapeFormat} from 'entity/shape-format';
import {ProductPhoto} from 'entity/product-photo';
import {ProductTag} from 'entity/product-tag';
import {ProductView} from 'entity/product-view';
import {Profession} from 'entity/profession';
import {Selection} from 'entity/selection';
import {ProductSelection} from 'entity/product-selection';
import {Tag} from 'entity/tag';
import {User} from 'entity/user';
import {ViewOfProductView} from 'entity/view-of-product-view';
import {ViewOfProductLike} from 'entity/view-of-product-like';
import {ViewOfProductFilters} from 'entity/view-of-product-filters';
import {ProductColor} from 'entity/product-color';
import {ViewOfProductMinMax} from 'entity/view-of-product-min-max';

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
                Gallery,
                Color,
                Country,
                Author,
                AuthorProfession,
                Interior,
                Product,
                ProductColor,
                Category,
                ProductLike,
                Style,
                Material,
                ShapeFormat,
                ProductSelection,
                ProductPhoto,
                ProductTag,
                ProductView,
                Profession,
                Selection,
                Tag,
                User,
                ViewOfProductView,
                ViewOfProductLike,
                ViewOfProductFilters,
                ViewOfProductMinMax
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
