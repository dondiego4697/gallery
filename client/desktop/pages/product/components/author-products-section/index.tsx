import {range} from 'lodash';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {HorizontalScrollContainer} from 'desktop/components/horizontal-scroll-container';
import {ProductCard} from 'desktop/components/product-card';
import {Skeleton} from 'desktop/components/skeleton';
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

        const title = (code?: string) => {
            return <TitleSection title="Другие работы автора" isDevider={true} />;
        };

        if (authorData.status === LoadableDataStatus.LOADING) {
            return (
                <section className={b()}>
                    {title()}
                    <Skeleton style={{width: 1200, margin: 'auto'}} />
                </section>
            );
        }

        const {author, products} = authorData;

        return (
            <section className={b()}>
                {title(author.code)}
                <HorizontalScrollContainer>
                    {products.map((it, i) => (
                        <ProductCard key={`product-page-product-${i}`} product={it} />
                    ))}
                </HorizontalScrollContainer>
            </section>
        );
    })
);
