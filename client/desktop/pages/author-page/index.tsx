import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {AuthorPageModel} from 'common/models/author-page';
import {UserModel} from 'common/models/user';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {AuthorSection} from './components/author-section';
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

        if (!authorPageModel) {
            return <div />;
        }

        return (
            <div className={b()}>
                <NavBar underline="dark" currentPath={props.match.path} />
                <AuthorSection />
                <OtherProductsSection />
                <Footer />
            </div>
        );
    })
);
