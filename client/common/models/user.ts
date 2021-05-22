import FingerprintJS from '@fingerprintjs/fingerprintjs';
import * as Cookie from 'js-cookie';
import {action, makeObservable, observable} from 'mobx';

interface ClientData {}

const FINGERPRINT_COOKIE_KEY = 'client_fingerprint';

export class UserModel {
    @observable public clientData: ClientData | null = null;
    @observable public fingerprint: string | null = null;

    constructor() {
        makeObservable(this);

        this.initFingerprint();
        this.loadClientData();
    }

    @action private loadClientData() {
        const node = window.document.getElementById('client-data-view');
        if (node) {
            this.clientData = node.textContent ? JSON.parse(node.textContent) : null;
        }
    }

    @action private initFingerprint() {
        if (this.fingerprint) {
            return;
        }

        const fingerprint = Cookie.get(FINGERPRINT_COOKIE_KEY);

        if (fingerprint) {
            this.fingerprint = fingerprint;
            return;
        }

        FingerprintJS.load()
            .then((fp) => fp.get())
            .then((result) => {
                this.fingerprint = result.visitorId;
                Cookie.set(FINGERPRINT_COOKIE_KEY, this.fingerprint, {expires: 1});
            });
    }
}
