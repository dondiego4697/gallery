import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {HeaderSection} from 'desktop/components/header-section';

import './index.scss';

const b = bevis('morda-selections-section');

interface SelectionCardProps {
    code: string;
    imageUrl: string;
    name: string;
    description?: string;
}

interface Props {
    selections: SelectionCardProps[];
}

function SelectionCard(props: SelectionCardProps) {
    const {code, imageUrl, name, description} = props;
    const b = bevis('morda-selection-card');

    return (
        <div className={b()}>
            <Link to={RoutePaths.SELECTION.replace(':code', code)}>
                <div className={b('blur')} />
                <div className={b('container')} style={{background: `url(${imageUrl})`}}>
                    <div className={b('text-container')}>
                        <h2>{name}</h2>
                        <p>{description?.slice(0, 100)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export function SelectionsSection(props: Props) {
    const {selections} = props;

    return (
        <section className={b()}>
            <HeaderSection
                title="Подборки"
                description="Потребность красоты и творчества, воплощающего её"
                to={RoutePaths.SELECTIONS}
                isDevider={true}
            />
            <div className={b('container')}>
                {selections.map((it, i) => (
                    <SelectionCard
                        key={`morda-selection-${i}`}
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
