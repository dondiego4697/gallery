import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    data: {
        text: string;
        interval: (number | null)[];
        imageUrl: string;
    };
    style?: React.CSSProperties;
}

const b = bevis('price-category-card');

export function PriceCategoryCard(props: Props) {
    const {data, style} = props;

    return (
        <div className={b()} style={style || {}}>
            <Link to={RoutePaths.CATALOG}>
                <div className={b('blur')} />
                <div className={b('container')} style={{background: `url(${data.imageUrl})`}}>
                    <div className={b('text-container')}>
                        <p>{data.text}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
}
