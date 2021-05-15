import * as React from 'react';
import {Link} from 'react-router-dom';

import {ButtonLink} from 'common/components/button-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    data: {
        text: string;
        interval: (number | null)[];
    };
    style?: React.CSSProperties;
}

const b = bevis('price-category-card');

export function PriceCategoryCard(props: Props) {
    const {data, style} = props;

    return (
        <div className={b()} style={style || {}}>
            <ButtonLink to={RoutePaths.CATALOG} text={data.text} style="dark" />
        </div>
    );
}
