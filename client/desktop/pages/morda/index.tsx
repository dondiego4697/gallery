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
import {AuthorCard} from 'desktop/components/author-card';
import {Devider} from 'desktop/components/devider';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';
import {PriceCategoryCard} from 'desktop/components/price-category-card';
import {ProductCard} from 'desktop/components/product-card';
import {SelectionCard} from 'desktop/components/selection-card';

import './index.scss';

interface Props extends RouteComponentProps {
    userModel?: UserModel;
    mordaPageModel?: MordaPageModel;
}

interface SectionHeaderParams {
    title: string;
    description?: string;
    to: string;
    isDevider?: boolean;
}

const b = bevis('morda');

const PRICE_CATEGORIES = [
    {
        text: 'до 40 тыс. ₽',
        interval: [null, 40],
        imageUrl: 'https://storage.yandexcloud.net/gallerian/selections/878cd3b6-0aa2-40e5-b791-d4051c6e6a87.png'
    },
    {
        text: '40 тыс. ₽ – 60 тыс. ₽',
        interval: [40, 60],
        imageUrl: 'https://storage.yandexcloud.net/gallerian/selections/878cd3b6-0aa2-40e5-b791-d4051c6e6a87.png'
    },
    {
        text: '60 тыс. ₽ – 120 тыс. ₽',
        interval: [60, 120],
        imageUrl: 'https://storage.yandexcloud.net/gallerian/selections/878cd3b6-0aa2-40e5-b791-d4051c6e6a87.png'
    },
    {
        text: '120 тыс. ₽ – 200 тыс. ₽',
        interval: [120, 200],
        imageUrl: 'https://storage.yandexcloud.net/gallerian/selections/878cd3b6-0aa2-40e5-b791-d4051c6e6a87.png'
    },
    {
        text: 'свыше 200 тыс. ₽',
        interval: [200, null],
        imageUrl: 'https://storage.yandexcloud.net/gallerian/selections/878cd3b6-0aa2-40e5-b791-d4051c6e6a87.png'
    }
];

function renderSectionHeader(params: SectionHeaderParams) {
    const {title, description, to, isDevider} = params;
    const b = bevis('morda-section-header');

    return (
        <section className={b()}>
            <div className={b('title')}>
                <h2>{title}</h2>
                <ButtonArrowLink to={to} text={'Смотреть\u00a0все'} />
            </div>
            {isDevider && <Devider />}
            {description && <p className={b('description')}>{description}</p>}
        </section>
    );
}

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
        <section className={b()}>
            {renderSectionHeader({
                title: 'Новинки',
                description: 'Потребность красоты и творчества, воплощающего её',
                to: RoutePaths.CATALOG,
                isDevider: true
            })}
            <div className={b('products-container')}>
                {products.map((it, i) => (
                    <ProductCard key={`morda-product-${i}`} product={it} style={i === 0 ? {marginLeft: 140} : {}} />
                ))}
                <div className={b('product-card-mock')} />
            </div>
        </section>
    );
}

function renderSelectionsSection(props: Props) {
    const b = bevis('morda-selections');

    const selections = props.mordaPageModel?.selections || [];

    return (
        <section className={b()}>
            {renderSectionHeader({
                title: 'Подборки',
                description: 'Потребность красоты и творчества, воплощающего её',
                to: RoutePaths.SELECTIONS,
                isDevider: true
            })}
            <div className={b('selections-container')}>
                {selections.slice(0, 5).map((it, i) => (
                    <SelectionCard key={`morda-selection-${i}`} selection={it} />
                ))}
            </div>
        </section>
    );
}

function renderAuthorsSection(props: Props) {
    const b = bevis('morda-authors');

    const authors = props.mordaPageModel?.authors || [];

    return (
        <section className={b()}>
            {renderSectionHeader({
                title: 'Художники',
                description: 'Where the spirit does not work with the hand there is no art',
                to: RoutePaths.ARTISTS
            })}
            <div className={b('authors-container')}>
                {authors.map((it, i) => (
                    <AuthorCard key={`morda-author-${i}`} author={it} />
                ))}
                <div className={b('product-card-mock')} />
            </div>
        </section>
    );
}

function renderPersonalSelectionSection() {
    const b = bevis('morda-personal-selection');

    return (
        <section className={b()}>
            <div className={b('container')}>
                <p className={b('text')}>
                    Where the spirit does not work with <br />
                    the hand there is no art
                </p>
                <ButtonLink to={RoutePaths.PERSONAL_SELECTION} text="РЕКОМЕНДАЦИИ" style="light" className={b('btn')} />
            </div>
        </section>
    );
}

function renderPriceCategorySection() {
    const b = bevis('morda-price-category');

    return (
        <section className={b()}>
            <div className={b('price-category-container')}>
                <div className={b('text-container')}>
                    <p>Where the spirit does not work with the hand there is no art</p>
                    <ButtonArrowLink className={b('see-all')} to={RoutePaths.CATALOG} text={'Смотреть\u00a0все'} />
                </div>
                {PRICE_CATEGORIES.map((it, i) => (
                    <PriceCategoryCard key={`morda-price-category-${i}`} data={it} />
                ))}
            </div>
        </section>
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
                {renderSelectionsSection(props)}
                {renderAuthorsSection(props)}
                {renderPersonalSelectionSection()}
                {renderPriceCategorySection()}
                <Footer />
            </div>
        );
    })
);
