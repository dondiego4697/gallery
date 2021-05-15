import {action, makeObservable, observable, runInAction} from 'mobx';

import {RequestBook} from 'common/request-book';
import {MordaMainResponse} from 'common/request-book/morda';

export class MordaPageModel {
    @observable public authors: MordaMainResponse.Author[] = [];
    @observable public products: MordaMainResponse.Product[] = [];
    @observable public selections: MordaMainResponse.Selection[] = [];

    constructor() {
        makeObservable(this);
    }

    @action public load() {
        RequestBook.morda.main().then((response) =>
            runInAction(() => {
                this.authors = response.authors;
                this.products = response.products;
                this.selections = response.selections;
            })
        );
    }
}
