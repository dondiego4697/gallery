import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {HeaderSection} from 'desktop/components/header-section';

import './index.scss';

interface Props {
    title: string;
    description?: string;
    to?: string;
    isDevider?: boolean;
    children: React.ReactNode;
    margin: number;
    style?: React.CSSProperties;
}

const b = bevis('horizontal-scroll-container');

export function HorizontalScrollContainer(props: Props) {
    const {title, description, to, isDevider, style, children, margin} = props;

    return (
        <div className={b()} style={style || {}}>
            <HeaderSection title={title} description={description} to={to} isDevider={isDevider} />
            <div className={b('container')}>
                <div style={{minWidth: margin}} />
                {React.Children.toArray(children).map((child, i) =>
                    React.cloneElement(child as any, {
                        style: {
                            marginLeft: i === 0 ? 0 : 30
                        }
                    })
                )}
                <div style={{minWidth: margin}} />
            </div>
        </div>
    );
}
