import {range} from 'lodash';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus, RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {MordaPageModel} from 'common/models/morda-page';
import {AuthorCard} from 'desktop/components/author-card';
import {Skeleton} from 'desktop/components/skeleton';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    mordaPageModel?: MordaPageModel;
}

const b = bevis('morda-page__authors-section');

export const AuthorsSection = inject('mordaPageModel')(
    observer((props: Props) => {
        const {mordaPageModel} = props;

        if (!mordaPageModel) {
            return <div />;
        }

        const {data} = mordaPageModel;

        const title = (
            <TitleSection
                title="Художники"
                description="Where the spirit does not work with the hand there is no art"
                to={RoutePaths.ARTISTS}
            />
        );

        if (data.status === LoadableDataStatus.LOADING) {
            return (
                <section className={b()}>
                    {title}
                    <div className={b('container')}>
                        {range(6).map((i) => (
                            <Skeleton key={`skeleton-author-card-${i}`} type="author-card" />
                        ))}
                    </div>
                </section>
            );
        }

        const {authors} = data;

        return (
            <section className={b()}>
                {title}
                <div className={b('container')}>
                    {authors.map((it, i) => (
                        <AuthorCard key={`morda-author-${i}`} author={it} />
                    ))}
                </div>
            </section>
        );
    })
);
