import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

const b = bevis('morda-page__selection-card');

export interface Props {
    code: string;
    imageUrl: string;
    name: string;
    description?: string;
}

export function MordaPageSelectionCard(props: Props) {
    const {code, imageUrl, name, description} = props;

    return (
        <div className={b()}>
            <Link to={RoutePaths.SELECTION.replace(':code', code)} className={b('link-container')}>
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
