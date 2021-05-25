import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {AuthorListPageModel} from 'common/models/author-list-page';

import './index.scss';

interface Props {
    authorListPageModel?: AuthorListPageModel;
}

const b = bevis('author-list-page__content-section');

export const ContentSection = inject('authorListPageModel')(
    observer((props: Props) => {
        const {authorListPageModel} = props;

        if (!authorListPageModel) {
            return <div />;
        }

        return <section className={b()}></section>;
    })
);
