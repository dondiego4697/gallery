import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {MordaPageModel} from 'common/models/morda-page';
import {UserModel} from 'common/models/user';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {AuthorsSection} from './components/authors-section';
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
        const {mordaPageModel} = props;

        React.useEffect(() => {
            mordaPageModel?.load();
        }, []);

        if (!mordaPageModel) {
            return <div />;
        }

        return (
            <div className={b()}>
                <NavBar underline="light" currentPath={props.match.path} />
                <BannerSection />
                <NewProductsSection />
                <SelectionsSection />
                <AuthorsSection />
                <PersonalSelectionsSection />
                <PriceCategorySection />
                <Footer />
            </div>
        );
    })
);
