import {toFinite} from 'lodash';
import {types as pgTypes} from 'pg';
import typeorm, {createConnection} from 'typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

import {config} from 'app/config';
import {Author} from 'entity/author';
import {AuthorProfession} from 'entity/author-profession';
import {Category} from 'entity/category';
import {City} from 'entity/city';
import {Color} from 'entity/color';
import {Country} from 'entity/country';
import {Gallery} from 'entity/gallery';
import {Interior} from 'entity/interior';
import {Material} from 'entity/material';
import {Product} from 'entity/product';
import {ProductColor} from 'entity/product-color';
import {ProductLike} from 'entity/product-like';
import {ProductPhoto} from 'entity/product-photo';
import {ProductSelection} from 'entity/product-selection';
import {ProductTag} from 'entity/product-tag';
import {ProductView} from 'entity/product-view';
import {Profession} from 'entity/profession';
import {Selection} from 'entity/selection';
import {ShapeFormat} from 'entity/shape-format';
import {Style} from 'entity/style';
import {Tag} from 'entity/tag';
import {User} from 'entity/user';
import {ViewOfProductFilters} from 'entity/view-of-product-filters';
import {ViewOfProductLike} from 'entity/view-of-product-like';
import {ViewOfProductMinMax} from 'entity/view-of-product-min-max';
import {ViewOfProductView} from 'entity/view-of-product-view';

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
