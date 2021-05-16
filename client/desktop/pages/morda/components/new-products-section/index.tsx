import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {HorizontalScrollContainer} from 'desktop/components/horizontal-scroll-container';
import {Product, ProductCard} from 'desktop/components/product-card';

import './index.scss';

interface Props {
    products: Product[];
}

const b = bevis('morda-new-products-section');

export function NewProductsSection(props: Props) {
    const {products} = props;

    return (
        <section className={b()}>
            <HorizontalScrollContainer
                title="Новинки"
                description="Потребность красоты и творчества, воплощающего её"
                to={RoutePaths.CATALOG}
                isDevider={true}
                margin={140}
            >
                {products.map((it, i) => (
                    <ProductCard key={`morda-page_product-${i}`} product={it} />
                ))}
            </HorizontalScrollContainer>
        </section>
    );
}
