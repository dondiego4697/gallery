import {AuthorGetInfoResponse} from '@server-types/response';
import {cloneDeep} from 'lodash';
import {action, makeObservable, observable, runInAction} from 'mobx';

import {LoadableDataStatus} from 'common/const';
import {RequestBook} from 'common/request-book';

type Author =
    | {
          status: LoadableDataStatus.LOADING;
          products: undefined;
          author: undefined;
      }
    | {
          status: LoadableDataStatus.DONE;
          products: AuthorGetInfoResponse.Product[];
          author: AuthorGetInfoResponse.Author;
      };

export class AuthorPageModel {
    private authorInit: Author = {
        status: LoadableDataStatus.LOADING,
        products: undefined,
        author: undefined
    };

    @observable public author = cloneDeep(this.authorInit);

    constructor() {
        makeObservable(this);
    }

    @action private initData() {
        this.author = cloneDeep(this.authorInit);
    }

    @action public load(code: string) {
        this.initData();

        RequestBook.author.getInfo(code).then((response) =>
            runInAction(() => {
                this.author = {
                    status: LoadableDataStatus.DONE,
                    author: response.author,
                    products: response.products
                };
            })
        );
    }
}
