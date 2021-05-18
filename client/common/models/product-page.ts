import {AuthorGetInfoResponse} from '@server-types/response';
import {ProductGetInfoResponse} from '@server-types/response';
import {action, makeObservable, observable, runInAction} from 'mobx';

import {RequestBook} from 'common/request-book';

export class ProductPageModel {
    @observable public author: AuthorGetInfoResponse.Author | undefined;
    @observable public authorProducts: AuthorGetInfoResponse.Product[] = [];
    @observable public product: ProductGetInfoResponse.Product | undefined;
    @observable public meta: ProductGetInfoResponse.Meta | undefined;

    constructor() {
        makeObservable(this);
    }

    @action public load(code: string) {
        RequestBook.product
            .getInfo(code)
            .then((response) => {
                runInAction(() => {
                    this.product = response.product;
                    this.meta = response.meta;
                });

                return RequestBook.author.getInfo(response.author.code);
            })
            .then((response) => {
                this.author = response.author;
                this.authorProducts = response.products.filter((it) => it.code !== this.product?.code);
            });
    }
}
