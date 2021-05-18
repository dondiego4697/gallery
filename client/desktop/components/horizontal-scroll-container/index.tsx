import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    children: React.ReactNode;
    marginHorizontal: number;
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('horizontal-scroll-container');

export function HorizontalScrollContainer(props: Props) {
    const {className, style, children, marginHorizontal} = props;

    return (
        <section className={cn(b(), className)} style={style || {}}>
            <div className={b('container')}>
                <div style={{minWidth: marginHorizontal}} />
                {React.Children.toArray(children).map((child, i) =>
                    React.cloneElement(child as any, {
                        style: {
                            marginLeft: i === 0 ? 0 : 30
                        }
                    })
                )}
                <div style={{minWidth: marginHorizontal}} />
            </div>
        </section>
    );
}
