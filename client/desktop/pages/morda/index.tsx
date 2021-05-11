import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {ButtonArrowLink} from 'common/components/button-arrow-link';
import {ButtonLink} from 'common/components/button-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {MordaPageModel} from 'common/models/morda-page';
import {UserModel} from 'common/models/user';
import {Devider} from 'desktop/components/devider';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';
import {ProductCard} from 'desktop/components/product-card';

import './index.scss';

interface Props extends RouteComponentProps {
    userModel?: UserModel;
    mordaPageModel?: MordaPageModel;
}

const b = bevis('morda');

function renderBannerSection() {
    const b = bevis('morda-banner');

    return (
        <section className={b()}>
            <div className={b('container')}>
                <h1>
                    Искусство есть высочайшее
                    <br />
                    проявление могущества в человеке
                </h1>
                <ButtonLink text="КАТАЛОГ" to={RoutePaths.CATALOG} style="light" className={b('btn')} />
            </div>
        </section>
    );
}

function renderNewProductsSection(props: Props) {
    const b = bevis('morda-new-products');

    const products = props.mordaPageModel?.products || [];

    return (
        <div className={b()}>
            <div className={b('title')}>
                <h2>Новинки</h2>
                <ButtonArrowLink to={RoutePaths.CATALOG} text={'Смотреть\u00a0все'} />
            </div>
            <Devider />
            <p className={b('description')}>Потребность красоты и творчества, воплощающего её</p>
            <div className={b('products-container')}>
                {products.map((it, i) => (
                    <ProductCard key={`morda-product-${i}`} product={it} style={i === 0 ? {marginLeft: 140} : {}} />
                ))}
                <div className={b('product-card-mock')} />
            </div>
        </div>
    );
}

export const MordaPage = inject(
    'userModel',
    'mordaPageModel'
)(
    observer((props: Props) => {
        useEffect(() => {
            props.mordaPageModel?.load();
        }, []);

        return (
            <div className={b()}>
                <NavBar />
                {renderBannerSection()}
                {renderNewProductsSection(props)}
                <Footer />
            </div>
        );
    })
);
