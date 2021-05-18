import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {HorizontalScrollContainer} from 'desktop/components/horizontal-scroll-container';
import {Product, ProductCard} from 'desktop/components/product-card';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    authorCode: string;
    products: Product[];
}

const b = bevis('product-page__author-products-section');

export function AuthorProductsSection(props: Props) {
    const {authorCode, products} = props;

    return (
        <section className={b()}>
            <TitleSection
                title="Другие работы автора"
                to={RoutePaths.ARTIST.replace(':code', authorCode)}
                isDevider={true}
            />
            <HorizontalScrollContainer marginHorizontal={140}>
                {products.map((it, i) => (
                    <ProductCard key={`product-page-product-${i}`} product={it} />
                ))}
            </HorizontalScrollContainer>
        </section>
    );
}
