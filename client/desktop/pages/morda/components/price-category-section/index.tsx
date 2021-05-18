import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ButtonLink} from 'desktop/components/button-link';

import './index.scss';

const b = bevis('morda-page__price-category-section');

const PRICE_CATEGORIES = [
    {
        text: 'до 40 тыс. ₽',
        interval: [null, 40]
    },
    {
        text: '40 тыс. ₽ – 60 тыс. ₽',
        interval: [40, 60]
    },
    {
        text: '60 тыс. ₽ – 120 тыс. ₽',
        interval: [60, 120]
    },
    {
        text: '120 тыс. ₽ – 200 тыс. ₽',
        interval: [120, 200]
    },
    {
        text: 'свыше 200 тыс. ₽',
        interval: [200, null]
    }
];

export function PriceCategorySection() {
    return (
        <section className={b()}>
            <div className={b('container')}>
                <div className={b('text-container')}>
                    <p>Поиск по цене</p>
                </div>
                <div className={b('btn-container')}>
                    {PRICE_CATEGORIES.map((it, i) => (
                        <ButtonLink
                            key={`morda-page-category-${i}`}
                            className={b('btn-link')}
                            to={RoutePaths.CATALOG}
                            text={it.text}
                            theme="dark"
                            style={{
                                marginLeft: i === 0 ? 0 : 15
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
