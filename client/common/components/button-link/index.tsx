import classnames from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    text: string;
    to: string;
    style: 'light' | 'dark';
    className?: string;
}

const b = bevis('btn-link');

export function ButtonLink(props: Props) {
    const {to, text, className, style} = props;

    return (
        <div
            className={classnames({
                [b()]: true,
                [b(style)]: true,
                ...(className ? {[className]: true} : {})
            })}
        >
            <Link to={to}>
                <div>{text}</div>
            </Link>
        </div>
    );
}
