import {MordaMainResponse} from '@server-types/response';
import {action, makeObservable, observable, runInAction} from 'mobx';

import {LoadableDataStatus} from 'common/const';
import {RequestBook} from 'common/request-book';

type Data =
    | {
          status: LoadableDataStatus.LOADING;
          authors: undefined;
          products: undefined;
          selections: undefined;
      }
    | {
          status: LoadableDataStatus.DONE;
          authors: MordaMainResponse.Author[];
          products: MordaMainResponse.Product[];
          selections: MordaMainResponse.Selection[];
      };

export class MordaPageModel {
    @observable public data: Data = {
        status: LoadableDataStatus.LOADING,
        products: undefined,
        authors: undefined,
        selections: undefined
    };

    constructor() {
        makeObservable(this);
    }

    @action public load() {
        RequestBook.morda.main().then((response) =>
            runInAction(() => {
                this.data = {
                    status: LoadableDataStatus.DONE,
                    products: response.products,
                    authors: response.authors,
                    selections: response.selections
                };
            })
        );
    }
}
