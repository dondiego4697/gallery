import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {Devider} from 'desktop/components/devider';
import {Tabs} from 'desktop/components/tabs';

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

interface RenderTabContentParams {
    description?: string;
}

function renderTabContent(key: TabKey, params: RenderTabContentParams = {}) {
    switch (key) {
        case TabKey.DESCRIPTION:
            return params.description;
        case TabKey.DELIVERY:
            return 'delivery';
        default:
            return '';
    }
}

// TODO
// 2. Добавить теги
// 3. Создать компонент просмотра фотографий
// 4. Добавить кнопки покупки
// 5. Добавить формирование интерьера

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
        const {photos, tags} = product;

        return (
            <section className={b()}>
                <div className={b('container')}>
                    <Tabs
                        className={b('tabs-container')}
                        defaultActiveKey={TabKey.DESCRIPTION}
                        keys={Object.values(TabKey)}
                        labels={['Описание', 'Условия доставки', 'Сертификат подлинности']}
                    >
                        <div className={b('tab-content')}>
                            {renderTabContent(TabKey.DESCRIPTION, {description: product.description})}
                        </div>
                        <div className={b('tab-content')}>{renderTabContent(TabKey.DELIVERY)}</div>
                        <div className={b('tab-content')}>{renderTabContent(TabKey.CERTIFICATE)}</div>
                    </Tabs>
                    <div className={b('interior-container')}>
                        <div className={b('interior-title')}>
                            <p>Примерка в интерьере</p>
                        </div>
                        <div className={b('interior-content')}>
                            <img src={photos[0]} />
                        </div>
                    </div>
                </div>
            </section>
        );
    })
);
