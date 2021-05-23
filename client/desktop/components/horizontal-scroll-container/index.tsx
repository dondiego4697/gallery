import cn from 'classnames';
import * as React from 'react';
import useResizeObserver from 'use-resize-observer';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('horizontal-scroll-container');
const MAX_WIDTH = 1200;

export function HorizontalScrollContainer(props: Props) {
    const {className, style, children} = props;

    const {ref: containerRef, width: containerWidth = 1} = useResizeObserver<HTMLDivElement>();
    const offset = (containerWidth - MAX_WIDTH) / 2;

    return (
        <section className={cn(b(), className)} style={style || {}} ref={containerRef}>
            <div className={b('container')}>
                <div style={{minWidth: offset}} />
                {React.Children.toArray(children).map((child, i) =>
                    React.cloneElement(child as any, {
                        style: {
                            marginLeft: i === 0 ? 0 : 30
                        }
                    })
                )}
                <div style={{minWidth: offset}} />
            </div>
        </section>
    );
}
