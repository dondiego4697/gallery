import cn from 'classnames';
import {range} from 'lodash';
import * as React from 'react';
import useResizeObserver from 'use-resize-observer';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    children: React.ReactNode;
    itemMaxWidth: number;
    minColumnGap: number;
    rowGap: number;
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('waterfall-container');

export function WaterfallContainer(props: Props) {
    const {style, rowGap, itemMaxWidth, minColumnGap, className} = props;

    const {ref: containerRef, width: containerWidth = 1} = useResizeObserver<HTMLDivElement>();

    const maxItemsInRowCount = Math.floor(containerWidth / (itemMaxWidth + minColumnGap));
    const columnGap = (containerWidth - maxItemsInRowCount * itemMaxWidth) / (maxItemsInRowCount - 1);

    const columns = range(maxItemsInRowCount).map((colIndex) => {
        return (
            <div className={b('column')} key={`waterfall-column-${colIndex}`}>
                {React.Children.toArray(props.children)
                    .map((child, i) => {
                        const index = i % maxItemsInRowCount;
                        const row = Math.trunc(i / maxItemsInRowCount);

                        if (colIndex === index) {
                            return React.cloneElement(child as any, {
                                key: `waterfall-container-${i}`,
                                style: {
                                    marginTop: row > 0 ? rowGap : 0,
                                    maxWidth: itemMaxWidth,
                                    marginLeft: index === 0 ? 0 : columnGap
                                }
                            });
                        }

                        return;
                    })
                    .filter(Boolean)}
            </div>
        );
    });

    return (
        <div className={cn(b(), className)} style={style || {}} ref={containerRef}>
            <div className={b('wrapper')}>{columns}</div>
        </div>
    );
}
