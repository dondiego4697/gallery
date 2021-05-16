import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {AuthorPageModel} from 'common/models/author-page';
import {UserModel} from 'common/models/user';
import {AuthorSection} from 'desktop/components/author-section';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {ProductsSection} from './components/products-section';

import './index.scss';

interface Props extends RouteComponentProps<{code: string}> {
    userModel?: UserModel;
    authorPageModel?: AuthorPageModel;
}

const b = bevis('author-page');

export const AuthorPage = inject(
    'userModel',
    'authorPageModel'
)(
    observer((props: Props) => {
        const {match, authorPageModel} = props;

        useEffect(() => {
            authorPageModel?.load(match.params.code);
        }, []);

        const author = authorPageModel?.author;
        const products = authorPageModel?.products || [];

        return (
            <div className={b()}>
                <NavBar underline="dark" />
                <AuthorSection
                    author={
                        author
                            ? {
                                  firstName: author.firstName,
                                  lastName: author.lastName,
                                  avatarUrl: author.avatarUrl,
                                  bio: author.bio,
                                  professions: author.professions
                              }
                            : undefined
                    }
                />
                {(authorPageModel?.products.length ?? 0) > 0 && <ProductsSection products={products} />}
                <Footer />
            </div>
        );
    })
);
