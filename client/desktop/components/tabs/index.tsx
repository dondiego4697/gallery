import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props<T> {
    style?: React.CSSProperties;
    className?: string;
    keys: T[];
    labels: string[];
    defaultActiveKey: T;
    onChange: (key: T) => void;
}

const b = bevis('tabs');

export function Tabs<T>(props: Props<T>) {
    const {keys, labels, defaultActiveKey, style, className, onChange} = props;

    const [activeKey, setActiveKey] = React.useState(defaultActiveKey);

    return (
        <div className={cn(b(), className)} style={style || {}}>
            <ul className={cn(b('container'))}>
                {keys.map((it, i) => (
                    <li
                        key={`tabs-btn-${i}`}
                        className={cn({
                            [b('item')]: true,
                            [b('item-active')]: it === activeKey
                        })}
                        onClick={() => {
                            setActiveKey(it);
                            onChange(it);
                        }}
                    >
                        <p>{labels[i]}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
