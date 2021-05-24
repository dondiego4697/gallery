import {ProductGetInfoResponse} from '@server-types/response';
import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {InteriorViewer} from 'desktop/components/interior-viewer';
import {Tabs} from 'desktop/components/tabs';
import {Tag} from 'desktop/components/tag';

import './index.scss';

interface Props {
    productPageModel?: ProductPageModel;
}

enum TabKey {
    DESCRIPTION = 'description',
    DELIVERY = 'delivery',
    CERTIFICATE = 'certificate'
}

const b = bevis('product-page__description-section');

function renderTabContent(key: TabKey, product: ProductGetInfoResponse.Product) {
    const {description, tags} = product;

    switch (key) {
        case TabKey.DESCRIPTION:
            return (
                <div className={b('description-container')}>
                    {description}
                    <div className={b('description-tags-container')}>
                        {tags.map((it, i) => (
                            <Tag key={`product-page-tag-${i}`} code={it.code} text={it.name} />
                        ))}
                    </div>
                </div>
            );
        case TabKey.DELIVERY:
            return 'delivery';
        case TabKey.CERTIFICATE:
            return 'cert';
        default:
            return '';
    }
}

export const DescriptionSection = inject('productPageModel')(
    observer((props: Props) => {
        const {productPageModel} = props;

        if (!productPageModel) {
            return <div />;
        }

        const {product: productData} = productPageModel;

        if (productData.status === LoadableDataStatus.LOADING) {
            return <div />;
        }

        const {product} = productData;
        const {photos, interiors} = product;

        return (
            <section className={b()}>
                <div className={b('container')}>
                    <Tabs
                        className={b('tabs-container')}
                        defaultActiveKey={TabKey.DESCRIPTION}
                        keys={Object.values(TabKey)}
                        labels={['Описание', 'Условия доставки', 'Сертификат подлинности']}
                    >
                        <div className={b('tab-content')}>{renderTabContent(TabKey.DESCRIPTION, product)}</div>
                        <div className={b('tab-content')}>{renderTabContent(TabKey.DELIVERY, product)}</div>
                        <div className={b('tab-content')}>{renderTabContent(TabKey.CERTIFICATE, product)}</div>
                    </Tabs>
                    <div className={b('interior-container')}>
                        <div className={b('interior-title')}>
                            <p>Примерка в интерьере</p>
                        </div>
                        <div className={b('interior-content')}>
                            <InteriorViewer productUrl={photos[0]} interior={interiors[0]} height={300} />
                        </div>
                    </div>
                </div>
            </section>
        );
    })
);
