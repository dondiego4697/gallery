import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {AuthorPageModel} from 'common/models/author-page';
import {UserModel} from 'common/models/user';
import {AboutAuthorSection} from 'desktop/components/about-author-section';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {OtherProductsSection} from './components/other-products-section';

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

        if (!author) {
            return <div />;
        }

        return (
            <div className={b()}>
                <NavBar underline="dark" currentPath={props.match.path} />
                <AboutAuthorSection
                    author={{
                        firstName: author.firstName,
                        lastName: author.lastName,
                        avatarUrl: author.avatarUrl,
                        bio: author.bio,
                        professions: author.professions
                    }}
                />
                {products.length > 0 && <OtherProductsSection products={products} />}
                <Footer />
            </div>
        );
    })
);
