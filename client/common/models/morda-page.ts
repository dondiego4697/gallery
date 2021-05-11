import {action, makeObservable, observable, runInAction} from 'mobx';

import {RequestBook} from 'common/request-book';
import {Author, Product} from 'common/request-book/morda';

export class MordaPageModel {
    @observable public authors: Author[] = [];
    @observable public products: Product[] = [];

    constructor() {
        makeObservable(this);
    }

    @action public load() {
        RequestBook.morda.main().then((response) =>
            runInAction(() => {
                this.authors = response.authors;
                this.products = response.products;
            })
        );
    }
}
