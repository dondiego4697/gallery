import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus, RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {HorizontalScrollContainer} from 'desktop/components/horizontal-scroll-container';
import {ProductCard} from 'desktop/components/product-card';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    productPageModel?: ProductPageModel;
}

const b = bevis('product-page__author-products-section');

export const AuthorProductsSection = inject('productPageModel')(
    observer((props: Props) => {
        const {productPageModel} = props;

        if (!productPageModel) {
            return <div />;
        }

        const {author: authorData} = productPageModel;

        if (authorData.status === LoadableDataStatus.LOADING) {
            return <div />;
        }

        const {author, products} = authorData;

        return (
            <section className={b()}>
                <TitleSection
                    title="Другие работы автора"
                    to={RoutePaths.ARTIST.replace(':code', author.code)}
                    isDevider={true}
                />
                <HorizontalScrollContainer marginHorizontal={140}>
                    {products.map((it, i) => (
                        <ProductCard key={`product-page-product-${i}`} product={it} />
                    ))}
                </HorizontalScrollContainer>
            </section>
        );
    })
);
