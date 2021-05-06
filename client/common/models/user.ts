import {action, observable} from 'mobx';

interface ClientConfig {}

export class UserModel {
    @observable public clientConfig: ClientConfig | null = null;

    constructor() {
        this.loadClientConfig();
    }

    @action private loadClientConfig() {
        const node = window.document.getElementsByClassName('config-view')[0];
        if (node) {
            this.clientConfig = node.textContent ? JSON.parse(node.textContent) : null;
        }
    }
}
