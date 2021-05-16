import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {MordaPageModel} from 'common/models/morda-page';
import {UserModel} from 'common/models/user';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {AuthorSection} from './components/author-section';
import {BannerSection} from './components/banner-section';
import {NewProductsSection} from './components/new-products-section';
import {PersonalSelectionsSection} from './components/personal-selections-section';
import {PriceCategorySection} from './components/price-category-section';
import {SelectionsSection} from './components/selections-section';

import './index.scss';

interface Props extends RouteComponentProps {
    userModel?: UserModel;
    mordaPageModel?: MordaPageModel;
}

const b = bevis('morda-page');

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
                <NavBar underline="light" />
                <BannerSection />
                <NewProductsSection
                    products={(props.mordaPageModel?.products || []).map((it) => ({
                        ...it,
                        photo: it.photos[0]
                    }))}
                />
                <SelectionsSection
                    selections={(props.mordaPageModel?.selections || []).slice(0, 5).map((it) => ({
                        code: it.code,
                        imageUrl: it.imageUrl,
                        name: it.name,
                        description: it.description
                    }))}
                />
                <AuthorSection
                    authors={(props.mordaPageModel?.authors || []).map((it) => ({
                        firstName: it.firstName,
                        lastName: it.lastName,
                        professions: it.professions,
                        code: it.code,
                        avatarUrl: it.avatarUrl
                    }))}
                />
                <PersonalSelectionsSection />
                <PriceCategorySection />
                <Footer />
            </div>
        );
    })
);
