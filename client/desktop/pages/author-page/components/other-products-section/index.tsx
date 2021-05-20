import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {AuthorPageModel} from 'common/models/author-page';
import {ProductCard} from 'desktop/components/product-card';
import {TitleSection} from 'desktop/components/title-section';
import {WaterfallContainer} from 'desktop/components/waterfall-container';

import './index.scss';

interface Props {
    authorPageModel?: AuthorPageModel;
}

const b = bevis('author-page__other-products-section');

export const OtherProductsSection = inject('authorPageModel')(
    observer((props: Props) => {
        const {authorPageModel} = props;

        if (!authorPageModel) {
            return <div />;
        }

        const {author: authorData} = authorPageModel;

        if (authorData.status === LoadableDataStatus.LOADING) {
            return <div />;
        }

        const {products} = authorData;

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
    })
);
