import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {UserModel} from 'common/models/user';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {AuthorProductsSection} from './components/author-products-section';
import {AuthorSection} from './components/author-section';
import {ContentSection} from './components/content-section';
import {DescriptionSection} from './components/description-section';

import './index.scss';

interface Props extends RouteComponentProps<{code: string}> {
    userModel?: UserModel;
    productPageModel?: ProductPageModel;
}

const b = bevis('product-page');

export const ProductPage = inject(
    'userModel',
    'productPageModel'
)(
    observer((props: Props) => {
        const {match, productPageModel} = props;

        useEffect(() => {
            productPageModel?.load(match.params.code);
        }, []);

        if (!productPageModel) {
            return <div />;
        }

        return (
            <div className={b()}>
                <NavBar underline="dark" currentPath={props.match.path} />
                <ContentSection />
                <DescriptionSection />
                <AuthorProductsSection />
                <AuthorSection />
                <Footer />
            </div>
        );
    })
);
