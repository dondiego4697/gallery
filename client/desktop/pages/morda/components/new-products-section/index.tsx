import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus, RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {MordaPageModel} from 'common/models/morda-page';
import {HorizontalScrollContainer} from 'desktop/components/horizontal-scroll-container';
import {ProductCard} from 'desktop/components/product-card';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    mordaPageModel?: MordaPageModel;
}

const b = bevis('morda-page__new-products-section');

export const NewProductsSection = inject('mordaPageModel')(
    observer((props: Props) => {
        const {mordaPageModel} = props;

        if (!mordaPageModel) {
            return <div />;
        }

        const {data} = mordaPageModel;

        if (data.status === LoadableDataStatus.LOADING) {
            return <div />;
        }

        const {products} = data;

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
                        <ProductCard
                            key={`morda-page-product-${i}`}
                            product={{
                                ...it,
                                photo: it.photos[0]
                            }}
                        />
                    ))}
                </HorizontalScrollContainer>
            </section>
        );
    })
);
