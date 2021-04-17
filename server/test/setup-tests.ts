/* eslint-disable @typescript-eslint/no-explicit-any */
import nock from 'nock';
import {EntityManager} from 'typeorm';
import {TransactionalTestContext} from 'typeorm-transactional-tests';

import {dbManager} from 'app/lib/db-manager';

type RunInTransaction = (entityManager: EntityManager) => Promise<any>;

class TestContext {
    protected transactionalContext: TransactionalTestContext;

    public async beforeAll() {
        nock.disableNetConnect();
        nock.enableNetConnect(/localhost/);
    }

    public async afterAll() {
        nock.enableNetConnect();

        const connection = await dbManager.getConnection();

        await connection.close();
    }

    public async beforeEach() {
        const connection = await dbManager.getConnection();

        this.transactionalContext = new TransactionalTestContext(connection);
        await this.transactionalContext.start();

        (EntityManager.prototype.transaction as any) = async (runInTransaction: RunInTransaction) => {
            await runInTransaction(connection.createQueryRunner().manager);
        };
    }

    public async afterEach() {
        nock.cleanAll();
        await this.transactionalContext.finish();
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
