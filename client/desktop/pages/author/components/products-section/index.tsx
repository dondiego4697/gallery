import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {Devider} from 'desktop/components/devider';
import {Product, ProductCard} from 'desktop/components/product-card';
import {WaterfallContainer} from 'desktop/components/waterfall-container';

import './index.scss';

interface Props {
    products: Product[];
}

const b = bevis('author-products-section');

export function ProductsSection(props: Props) {
    const {products} = props;

    return (
        <section className={b()}>
            <h2 className={b('title')}>Работы автора</h2>
            <Devider />
            <div className={b('products-container')}>
                <WaterfallContainer itemMaxWidth={250} minColumnGap={30} rowGap={80}>
                    {products.map((it, i) => (
                        <ProductCard
                            key={`author-page_product-${i}`}
                            product={{
                                ...it,
                                photo: it.photo
                            }}
                        />
                    ))}
                </WaterfallContainer>
            </div>
        </section>
    );
}
