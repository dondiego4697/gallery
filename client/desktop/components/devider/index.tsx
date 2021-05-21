import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    className?: string;
    style?: React.CSSProperties;
}

const b = bevis('devider');

export function Devider(props: Props) {
    const {style, className} = props;

    return <div className={cn(b(), className)} style={style || {}} />;
}
