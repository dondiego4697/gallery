import {toFinite} from 'lodash';
import {types as pgTypes} from 'pg';
import typeorm, {createConnection} from 'typeorm';
import {config} from 'app/config';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {Author} from 'entity/author';
import {Interior} from 'entity/interior';
import {Picture} from 'entity/picture';
import {PictureShape} from 'entity/picture-shape';
import {PictureStyle} from 'entity/picture-style';
import {PicturePhoto} from 'entity/picture-photo';
import {PictureView} from 'entity/picture-view';
import {Selection} from 'entity/selection';
import {SelectionPicture} from 'entity/selection-picture';
import {User} from 'entity/user';
import {PictureLike} from 'entity/picture-like';
import {ViewOfPictureView} from 'entity/view-of-picture-view';

pgTypes.setTypeParser(20, toFinite);

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
                Author,
                Interior,
                Picture,
                PictureShape,
                PictureStyle,
                PicturePhoto,
                PictureView,
                Selection,
                SelectionPicture,
                User,
                PictureLike,
                ViewOfPictureView
            ],
            logging: config['logger.db.level'],
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
