/* eslint-disable max-len */
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {Devider} from 'desktop/components/devider';
import {Tabs} from 'desktop/components/tabs';

import './index.scss';

interface Props {
    tags: {
        code: string;
        name: string;
    }[];
    interiors: string[];
}

enum TabKey {
    DESCRIPTION = 'description',
    DELIVERY = 'delivery',
    CERTIFICATE = 'certificate'
}

const b = bevis('product-page__description-section');

function renderTabContent(key: TabKey) {
    switch (key) {
        default:
            return `Скульптура была возведена в 2000 году и представляет собой большой купол, созданный из голубого стекла и имеющий диаметр 10 метров. Купол поддерживается четырьмя деревьями из металла, а под самим куполом находятся огромные фигуры девушки и юноши, летящие друг другу навстречу. Данная композиция символизирует любовь, брак и единение мужского и женского начала. 
            К этой чудесной скульптуре каждую субботу приезжают влюбленные молодожены со всех концов города, чтобы под куполом сферы закружиться в первом танце в качестве мужа и жены. `;
    }
}

// TODO
// 1. Засунуть контент под табы
// 2. Добавить теги
// 3. Создать компонент просмотра фотографий
// 4. Добавить кнопки покупки
// 5. Добавить формирование интерьера

export const DescriptionSection = (props: Props) => {
    const {interiors, tags} = props;

    const defaultActiveKey = TabKey.DESCRIPTION;
    const [activeKey, setActiveKey] = React.useState(defaultActiveKey);

    return (
        <section className={b()}>
            <div className={b('control-container')}>
                <Tabs
                    className={b('tabs-container')}
                    defaultActiveKey={defaultActiveKey}
                    keys={Object.values(TabKey)}
                    labels={['Описание', 'Условия доставки', 'Сертификат подлинности']}
                    onChange={(key) => setActiveKey(key)}
                />
                <div className={b('interior-title')}>
                    <p>Примерка в интерьере</p>
                </div>
            </div>
            <Devider className={b('devider')} />
            <div className={b('content-container')}>
                <div className={b('tab-content')}>{renderTabContent(activeKey)}</div>
                <div className={b('interior-content')}>
                    <img src={interiors[0]} />
                </div>
            </div>
        </section>
    );
};
