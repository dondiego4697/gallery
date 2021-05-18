import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {HorizontalScrollContainer} from 'desktop/components/horizontal-scroll-container';
import {Product, ProductCard} from 'desktop/components/product-card';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    products: Product[];
}

const b = bevis('morda-page__new-products-section');

export function NewProductsSection(props: Props) {
    const {products} = props;

    return (
        <section className={b()}>
            <TitleSection
                title="Новинки"
                description="Потребность красоты и творчества, воплощающего её"
                to={RoutePaths.CATALOG}
                isDevider={true}
            />
            <HorizontalScrollContainer marginHorizontal={140}>
                {products.map((it, i) => (
                    <ProductCard key={`morda-page-product-${i}`} product={it} />
                ))}
            </HorizontalScrollContainer>
        </section>
    );
}
