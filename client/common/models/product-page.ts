import {AuthorGetInfoResponse} from '@server-types/response';
import {ProductGetInfoResponse} from '@server-types/response';
import {cloneDeep} from 'lodash';
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
    private code: string | undefined;
    private productInit: Product = {
        status: LoadableDataStatus.LOADING,
        product: undefined,
        author: undefined,
        meta: undefined
    };

    private authorInit: Author = {
        status: LoadableDataStatus.LOADING,
        author: undefined,
        products: undefined
    };

    @observable public product = cloneDeep(this.productInit);
    @observable public author = cloneDeep(this.authorInit);

    constructor() {
        makeObservable(this);
    }

    @action private initData() {
        this.product = cloneDeep(this.productInit);
        this.author = cloneDeep(this.authorInit);
    }

    @action public load(code: string) {
        this.code = code;

        this.initData();

        RequestBook.product.setView(code);

        RequestBook.product
            .getInfo(code)
            .then((response) =>
                runInAction(() => {
                    this.product = {
                        status: LoadableDataStatus.DONE,
                        meta: response.meta,
                        author: response.author,
                        product: response.product
                    };

                    return RequestBook.author.getInfo(response.author.code);
                })
            )
            .then((response) =>
                runInAction(() => {
                    this.author = {
                        status: LoadableDataStatus.DONE,
                        author: response.author,
                        products: response.products.filter((it) => it.code !== this.product.product?.code)
                    };
                })
            );
    }

    @action public like() {
        if (!this.code) {
            return;
        }

        RequestBook.product.setLike(this.code).then(() => {
            if (this.product.status === LoadableDataStatus.LOADING) {
                return;
            }

            this.product.meta.isLike = !this.product.meta.isLike;
        });
    }
}
