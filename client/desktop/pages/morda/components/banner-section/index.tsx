import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ButtonLink} from 'desktop/components/button-link';

import './index.scss';

const b = bevis('morda-page__banner-section');

export function BannerSection() {
    return (
        <section className={b()}>
            <div className={b('container')}>
                <h1>
                    Искусство есть высочайшее
                    <br />
                    проявление могущества в человеке
                </h1>
                <ButtonLink text="КАТАЛОГ" to={RoutePaths.CATALOG} theme="light" className={b('btn')} />
            </div>
        </section>
    );
}
