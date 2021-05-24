import {MordaMainResponse} from '@server-types/response';
import {cloneDeep} from 'lodash';
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
    @observable private dataInit: Data = {
        status: LoadableDataStatus.LOADING,
        products: undefined,
        authors: undefined,
        selections: undefined
    };

    @observable public data = cloneDeep(this.dataInit);

    constructor() {
        makeObservable(this);
    }

    @action private initData() {
        this.data = cloneDeep(this.dataInit);
    }

    @action public load() {
        this.initData();

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
