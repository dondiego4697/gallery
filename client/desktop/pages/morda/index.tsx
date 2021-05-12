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
import {ProductCard} from 'desktop/components/product-card';

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

function renderSectionHeader(params: SectionHeaderParams) {
    const {title, description, to, isDevider} = params;
    const b = bevis('morda-section-header');

    return (
        <div className={b()}>
            <div className={b('title')}>
                <h2>{title}</h2>
                <ButtonArrowLink to={to} text={'Смотреть\u00a0все'} />
            </div>
            {isDevider && <Devider />}
            {description && <p className={b('description')}>{description}</p>}
        </div>
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

    return (
        <section className={b()}>
            {renderSectionHeader({
                title: 'Подборки',
                description: 'Потребность красоты и творчества, воплощающего её',
                to: RoutePaths.SELECTIONS
            })}
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
        <div className={b()}>
            <div className={b('container')}>
                <p className={b('text')}>
                    Where the spirit does not work with <br />
                    the hand there is no art
                </p>
                <ButtonLink to={RoutePaths.PERSONAL_SELECTION} text="РЕКОМЕНДАЦИИ" style="light" className={b('btn')} />
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
                {renderSelectionsSection(props)}
                {renderAuthorsSection(props)}
                {renderPersonalSelectionSection()}
                <Footer />
            </div>
        );
    })
);
