import cn from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    text: string;
    to: string;
    theme: 'light' | 'dark';
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('btn-link');

export function ButtonLink(props: Props) {
    const {to, text, className, theme, style} = props;

    return (
        <div className={cn(b(), b(theme), className)} style={style || {}}>
            <Link to={to} className={b('link')}>
                <div className={b('text-container')}>{text}</div>
            </Link>
        </div>
    );
}
