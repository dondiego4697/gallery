import cn from 'classnames';
import {range} from 'lodash';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

type Type = 'text' | 'product-card' | 'author-card';

interface Props {
    type: Type;
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('skeleton');

function getContainer(type: Type) {
    if (type === 'product-card') {
        return <div className={b(type)}>{SVG.Picture}</div>;
    }

    if (type === 'text') {
        return (
            <div className={b(type)}>
                {range(4).map((i) => (
                    <li key={`skeleton-text-row-${i}`} />
                ))}
            </div>
        );
    }

    if (type === 'author-card') {
        return (
            <div className={b(type)}>
                {SVG.User}
                {range(3).map((i) => (
                    <li key={`skeleton-author-card-row-${i}`} />
                ))}
            </div>
        );
    }
}

export function Skeleton(props: Props) {
    const {type, style, className} = props;

    return (
        <div className={cn(b(), className)} style={style || {}}>
            {getContainer(type)}
        </div>
    );
}
