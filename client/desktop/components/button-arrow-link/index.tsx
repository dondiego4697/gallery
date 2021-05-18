import cn from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

interface Props {
    to: string;
    text?: string;
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('btn-arrow-link');

export function ButtonArrowLink(props: Props) {
    const {to, text, className, style} = props;

    return (
        <div className={cn(b(), className)} style={style || {}}>
            <Link to={to} className={b('link')}>
                {text || ''}
                {SVG.Arrow}
            </Link>
        </div>
    );
}
