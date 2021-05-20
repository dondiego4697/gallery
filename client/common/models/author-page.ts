import {AuthorGetInfoResponse} from '@server-types/response';
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
    @observable public author: Author = {
        status: LoadableDataStatus.LOADING,
        products: undefined,
        author: undefined
    };

    constructor() {
        makeObservable(this);
    }

    @action public load(code: string) {
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
