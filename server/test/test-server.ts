/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'http';
import net from 'net';

import {app} from 'app/app';

export class TestServer {
    protected url?: string;
    protected server?: http.Server;

    public async getServerAddress() {
        if (this.url) {
            return this.url;
        }

        return this.startServer();
    }

    public async stopServer() {
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

    protected async startServer() {
        const server = http.createServer(app);

        await new Promise((resolve) => server.listen(resolve));

        const port = (server.address() as net.AddressInfo).port;

        this.server = server;
        this.url = `http://localhost:${port}`;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.url!;
    }
}
