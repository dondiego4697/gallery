import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {Selection} from 'common/request-book/morda';

import './index.scss';

interface Props {
    selection: Selection;
    style?: React.CSSProperties;
}

const b = bevis('selection-card');

export function SelectionCard(props: Props) {
    const {
        selection: {item: selection},
        style
    } = props;

    return (
        <div className={b()} style={style || {}}>
            <Link to={RoutePaths.SELECTION.replace(':code', selection.code)}>
                <div className={b('blur')} />
                <div className={b('container')} style={{background: `url(${selection.imageUrl})`}}>
                    <div className={b('text-container')}>
                        <h2>{selection.name}</h2>
                        <p>{selection.description?.slice(0, 100)}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
