/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'http';
import net from 'net';
import nock from 'nock';
import {TransactionalTestContext} from 'typeorm-transactional-tests';

import {app} from 'app/app';
import {dbManager} from 'app/lib/db-manager';

class TestContext {
    protected server?: http.Server;
    protected url?: string;
    protected transactionalContext: TransactionalTestContext;

    public async getServerAddress() {
        if (this.url) {
            return this.url;
        }

        return this.startServer();
    }

    public async beforeAll() {
        nock.disableNetConnect();
        nock.enableNetConnect(/localhost/);
    }

    public async afterAll() {
        await this.stopServer();
        nock.enableNetConnect();

        const connection = await dbManager.getConnection();

        await connection.close();
    }

    public async beforeEach() {
        const connection = await dbManager.getConnection();

        this.transactionalContext = new TransactionalTestContext(connection);
        await this.transactionalContext.start();
    }

    public async afterEach() {
        nock.cleanAll();
        await this.transactionalContext.finish();
    }

    protected async startServer() {
        const server = http.createServer(app);

        await new Promise((resolve) => server.listen(resolve));

        const port = (server.address() as net.AddressInfo).port;

        this.server = server;
        this.url = `http://localhost:${port}`;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.url!;
    }

    protected async stopServer() {
        if (!this.server) {
            return;
        }

        await new Promise<void>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.server!.close((error: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        this.server = undefined;
    }
}

const textContext = new TestContext();

beforeEach(async () => {
    await textContext.beforeEach();
});

afterEach(async () => {
    await textContext.afterEach();
});

beforeAll(async () => {
    await textContext.beforeAll();
});

afterAll(async () => {
    await textContext.afterAll();
});
