import * as React from 'react';

import {ButtonArrowLink} from 'common/components/button-arrow-link';
import {bevis} from 'common/lib/bevis';
import {Devider} from 'desktop/components/devider';

import './index.scss';

interface Props {
    title: string;
    description?: string;
    to?: string;
    isDevider?: boolean;
    style?: React.CSSProperties;
}

const b = bevis('header-section');

export function HeaderSection(props: Props) {
    const {title, description, to, isDevider, style} = props;

    return (
        <section className={b()} style={style || {}}>
            <div className={b('title')}>
                <h2>{title}</h2>
                {to && <ButtonArrowLink to={to} text={'Смотреть\u00a0все'} />}
            </div>
            {isDevider && <Devider />}
            {description && <p className={b('description')}>{description}</p>}
        </section>
    );
}
