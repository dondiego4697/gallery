import {action, makeObservable, observable} from 'mobx';

import {RequestBook} from 'common/request-book';
import {MordaMainResponse} from 'common/request-book/morda';

export class MordaPageModel {
    @observable public authors: MordaMainResponse['authors'] = [];
    @observable public products: MordaMainResponse['products'] = [];

    constructor() {
        makeObservable(this);
    }

    @action public load() {
        RequestBook.morda.main().then((response) => {
            this.authors = response.authors;
            this.products = response.products;
        });
    }
}
