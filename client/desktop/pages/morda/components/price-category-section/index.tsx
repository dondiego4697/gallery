import * as React from 'react';

import {ButtonLink} from 'common/components/button-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

interface PriceCategoryCardProps {
    text: string;
    interval: (number | null)[];
    style?: React.CSSProperties;
}

const b = bevis('morda-price-category-section');

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

function PriceCategoryCard(props: PriceCategoryCardProps) {
    const {text, style} = props;
    const b = bevis('morda-price-category-card');

    return (
        <div className={b()} style={style || {}}>
            <ButtonLink to={RoutePaths.CATALOG} text={text} style="dark" />
        </div>
    );
}

export function PriceCategorySection() {
    return (
        <section className={b()}>
            <div className={b('container')}>
                <div className={b('text-container')}>
                    <p>Поиск по цене</p>
                </div>
                <div className={b('btn-container')}>
                    {PRICE_CATEGORIES.map((it, i) => (
                        <PriceCategoryCard
                            style={{
                                marginLeft: i === 0 ? 0 : 15
                            }}
                            key={`morda-price-category-${i}`}
                            text={it.text}
                            interval={it.interval}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
