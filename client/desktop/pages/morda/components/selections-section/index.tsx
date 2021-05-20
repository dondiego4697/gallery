import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus, RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {MordaPageModel} from 'common/models/morda-page';
import {TitleSection} from 'desktop/components/title-section';

import {MordaPageSelectionCard} from './components/selection-card';

import './index.scss';

const b = bevis('morda-page__selections-section');

interface Props {
    mordaPageModel?: MordaPageModel;
}

export const SelectionsSection = inject('mordaPageModel')(
    observer((props: Props) => {
        const {mordaPageModel} = props;

        if (!mordaPageModel) {
            return <div />;
        }

        const {data} = mordaPageModel;

        if (data.status === LoadableDataStatus.LOADING) {
            return <div />;
        }

        const {selections} = data;

        return (
            <section className={b()}>
                <TitleSection
                    title="Подборки"
                    description="Потребность красоты и творчества, воплощающего её"
                    to={RoutePaths.SELECTIONS}
                    isDevider={true}
                />
                <div className={b('container')}>
                    {selections.slice(0, 5).map((it, i) => (
                        <MordaPageSelectionCard
                            key={`morda-page-selection-${i}`}
                            code={it.code}
                            imageUrl={it.imageUrl}
                            name={it.name}
                            description={it.description}
                        />
                    ))}
                </div>
            </section>
        );
    })
);
