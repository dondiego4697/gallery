import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {ButtonArrowLink} from 'desktop/components/button-arrow-link';
import {Devider} from 'desktop/components/devider';

import './index.scss';

interface Props {
    title: string;
    description?: string;
    to?: string;
    isDevider?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('title-section');

export function TitleSection(props: Props) {
    const {title, description, className, to, isDevider, style} = props;

    return (
        <section className={cn(b(), className)} style={style || {}}>
            <div className={b('title-container')}>
                <h2 className={b('title')}>{title}</h2>
                {to && <ButtonArrowLink to={to} text={'Смотреть\u00a0все'} />}
            </div>
            {isDevider && <Devider />}
            {description && <p className={b('description')}>{description}</p>}
        </section>
    );
}
