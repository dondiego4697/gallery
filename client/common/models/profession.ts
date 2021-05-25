import {ProfessionGetListResponse} from '@server-types/response';
import {action, makeObservable, observable, runInAction} from 'mobx';

import {RequestBook} from 'common/request-book';

export class ProfessionModel {
    @observable public professions: ProfessionGetListResponse.Profession[] = [];

    constructor() {
        makeObservable(this);

        this.load();
    }

    @action public load() {
        RequestBook.profession.getList().then((response) =>
            runInAction(() => {
                this.professions = response;
            })
        );
    }

    public findByName(name?: string) {
        if (!name) {
            return;
        }

        return this.professions.find((it) => it.name === name);
    }

    public findByCode(code?: string | null) {
        if (!code) {
            return;
        }

        return this.professions.find((it) => it.code === code);
    }
}
