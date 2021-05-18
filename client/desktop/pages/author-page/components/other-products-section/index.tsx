import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {Product, ProductCard} from 'desktop/components/product-card';
import {TitleSection} from 'desktop/components/title-section';
import {WaterfallContainer} from 'desktop/components/waterfall-container';

import './index.scss';

interface Props {
    products: Product[];
}

const b = bevis('author-page__other-products-section');

export function OtherProductsSection(props: Props) {
    const {products} = props;

    return (
        <section className={b()}>
            <TitleSection title="Другие работы автора" isDevider={true} />
            <div className={b('container')}>
                <WaterfallContainer itemMaxWidth={250} minColumnGap={30} rowGap={80}>
                    {products.map((it, i) => (
                        <ProductCard key={`author-page-product-${i}`} product={it} />
                    ))}
                </WaterfallContainer>
            </div>
        </section>
    );
}
