import {AuthorGetInfoResponse} from '@server-types/response';
import {ProductGetInfoResponse} from '@server-types/response';
import {action, makeObservable, observable, runInAction} from 'mobx';

import {LoadableDataStatus} from 'common/const';
import {RequestBook} from 'common/request-book';

type Product =
    | {
          status: LoadableDataStatus.LOADING;
          product: undefined;
          author: undefined;
          meta: undefined;
      }
    | {
          status: LoadableDataStatus.DONE;
          product: ProductGetInfoResponse.Product;
          author: ProductGetInfoResponse.Author;
          meta: ProductGetInfoResponse.Meta;
      };

type Author =
    | {
          status: LoadableDataStatus.LOADING;
          author: undefined;
          products: undefined;
      }
    | {
          status: LoadableDataStatus.DONE;
          author: AuthorGetInfoResponse.Author;
          products: AuthorGetInfoResponse.Product[];
      };

export class ProductPageModel {
    @observable public product: Product = {
        status: LoadableDataStatus.LOADING,
        product: undefined,
        author: undefined,
        meta: undefined
    };

    @observable public author: Author = {
        status: LoadableDataStatus.LOADING,
        author: undefined,
        products: undefined
    };

    constructor() {
        makeObservable(this);
    }

    @action public load(code: string) {
        RequestBook.product
            .getInfo(code)
            .then((response) => {
                runInAction(() => {
                    this.product = {
                        status: LoadableDataStatus.DONE,
                        meta: response.meta,
                        author: response.author,
                        product: response.product
                    };
                });

                return RequestBook.author.getInfo(response.author.code);
            })
            .then((response) => {
                this.author = {
                    status: LoadableDataStatus.DONE,
                    author: response.author,
                    products: response.products.filter((it) => it.code !== this.product.product?.code)
                };
            });
    }
}
