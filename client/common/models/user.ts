import FingerprintJS from '@fingerprintjs/fingerprintjs';
import {action, observable} from 'mobx';

interface ClientConfig {}

export class UserModel {
    @observable public clientConfig: ClientConfig | null = null;
    @observable public fingerprint: string | null = null;

    constructor() {
        this.loadClientConfig();
        this.getFingerprint();
    }

    @action private loadClientConfig() {
        const node = window.document.getElementsByClassName('config-view')[0];
        if (node) {
            this.clientConfig = node.textContent ? JSON.parse(node.textContent) : null;
        }
    }

    @action private getFingerprint() {
        FingerprintJS.load()
            .then((fp) => fp.get())
            .then((result) => (this.fingerprint = result.visitorId));
    }
}
