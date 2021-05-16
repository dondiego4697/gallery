import {action, makeObservable, observable, runInAction} from 'mobx';

import {RequestBook} from 'common/request-book';
import {AuthorGetInfoResponse} from 'common/request-book/author';
import {ProductGetInfoResponse} from 'common/request-book/product';

export class ProductPageModel {
    @observable public author: ProductGetInfoResponse.Author | null = null;
    @observable public authorProducts: AuthorGetInfoResponse.Product[] = [];
    @observable public product: ProductGetInfoResponse.Product | null = null;
    @observable public meta: ProductGetInfoResponse.Meta | null = null;

    constructor() {
        makeObservable(this);
    }

    @action public load(code: string) {
        RequestBook.product
            .getInfo(code)
            .then((response) => {
                runInAction(() => {
                    this.author = response.author;
                    this.product = response.product;
                    this.meta = response.meta;
                });

                return RequestBook.author.getInfo(response.author.code);
            })
            .then((response) => {
                this.authorProducts = response.products;
            });
    }
}
