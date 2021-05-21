import cn from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    className?: string;
    style?: React.CSSProperties;
    code: string;
    text: string;
}

const b = bevis('tag');

export function Tag(props: Props) {
    const {style, className, text} = props;

    return (
        <Link className={cn(b(), className)} style={style || {}} to={RoutePaths.CATALOG}>
            {text}
        </Link>
    );
}
