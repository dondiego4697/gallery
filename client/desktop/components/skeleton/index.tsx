import cn from 'classnames';
import {range} from 'lodash';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('skeleton');

export function Skeleton(props: Props) {
    const {style, className} = props;

    return (
        <div className={cn(b(), className)} style={style || {}}>
            <div className={b('text')}>
                {range(4).map((i) => (
                    <li key={`skeleton-text-row-${i}`} />
                ))}
            </div>
        </div>
    );
}
