import {AuthorGetListResponse} from '@server-types/response';
import {action, computed, makeObservable, observable, runInAction} from 'mobx';

import {LoadableDataStatus} from 'common/const';
import {RequestBook} from 'common/request-book';

interface Params {
    firstLetter?: string | null;
    searchQuery?: string | null;
    professionCode?: string | null;
}

const LIMIT = 20;

export class AuthorListPageModel {
    @observable public status = LoadableDataStatus.LOADING;
    @observable public authors: AuthorGetListResponse.Author[] = [];
    @observable public totalCount = 0;
    @observable private lastParams: Params = {};

    constructor() {
        makeObservable(this);
    }

    @computed public get offset() {
        return this.authors.length;
    }

    @action public load(params: Params) {
        runInAction(() => {
            this.status = LoadableDataStatus.LOADING;
            this.authors = [];
            this.lastParams = {
                ...this.lastParams,
                ...params
            };

            RequestBook.author
                .getList({
                    firstLetter: params.firstLetter || undefined,
                    searchQuery: params.searchQuery || undefined,
                    professionCode: params.professionCode || undefined,
                    limit: LIMIT,
                    offset: this.offset
                })
                .then((response) => {
                    this.totalCount = response.totalCount;
                    this.authors = response.authors;
                    this.status = LoadableDataStatus.DONE;
                });
        });
    }

    @action public loadMore() {
        runInAction(() => {
            this.status = LoadableDataStatus.LOADING;

            RequestBook.author
                .getList({
                    firstLetter: this.lastParams.firstLetter || undefined,
                    searchQuery: this.lastParams.searchQuery || undefined,
                    professionCode: this.lastParams.professionCode || undefined,
                    limit: LIMIT,
                    offset: this.offset
                })
                .then((response) => {
                    this.authors.push(...response.authors);
                    this.status = LoadableDataStatus.DONE;
                });
        });
    }
}
