import {action, makeObservable, observable, runInAction} from 'mobx';

import {RequestBook} from 'common/request-book';
import {AuthorGetInfoResponse} from 'common/request-book/author';

export class AuthorPageModel {
    @observable public author: AuthorGetInfoResponse.Author | null = null;
    @observable public products: AuthorGetInfoResponse.Product[] = [];

    constructor() {
        makeObservable(this);
    }

    @action public load(code: string) {
        RequestBook.author.getInfo(code).then((response) =>
            runInAction(() => {
                this.author = response.author;
                this.products = response.products;
            })
        );
    }
}
