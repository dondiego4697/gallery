import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {TitleSection} from 'desktop/components/title-section';

import {MordaPageSelectionCard, Props as SelectionCardProps} from './components/selection-card';

import './index.scss';

const b = bevis('morda-page__selections-section');

interface Props {
    selections: SelectionCardProps[];
}

export function SelectionsSection(props: Props) {
    const {selections} = props;

    return (
        <section className={b()}>
            <TitleSection
                title="Подборки"
                description="Потребность красоты и творчества, воплощающего её"
                to={RoutePaths.SELECTIONS}
                isDevider={true}
            />
            <div className={b('container')}>
                {selections.map((it, i) => (
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
}
