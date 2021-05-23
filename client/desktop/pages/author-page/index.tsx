import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {AuthorPageModel} from 'common/models/author-page';
import {UserModel} from 'common/models/user';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {AuthorSection} from './components/author-section';
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

        React.useEffect(() => {
            authorPageModel?.load(match.params.code);
        }, [match.params.code]);

        if (!authorPageModel) {
            return <div />;
        }

        return (
            <div className={b()}>
                <NavBar underline="dark" currentPath={props.match.path} />
                <AuthorSection />
                <ProductsSection />
                <Footer />
            </div>
        );
    })
);
