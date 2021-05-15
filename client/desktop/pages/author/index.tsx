import {omit, startCase} from 'lodash';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {useEffect} from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {AuthorPageModel} from 'common/models/author-page';
import {UserModel} from 'common/models/user';
import {Devider} from 'desktop/components/devider';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';
import {ProductCard} from 'desktop/components/product-card';
import {WaterfallContainer} from 'desktop/components/waterfall-container';

import './index.scss';

interface Props extends RouteComponentProps<{code: string}> {
    userModel?: UserModel;
    authorPageModel?: AuthorPageModel;
}

const b = bevis('author-page');

function renderAuthorInfoSection(props: Props) {
    const b = bevis('author-page-author-info');
    const {authorPageModel} = props;

    const name = `${authorPageModel?.author?.firstName} ${authorPageModel?.author?.lastName}`;
    const professions = startCase(authorPageModel?.author?.professions.join(', ').toLowerCase());

    return (
        <section className={b()}>
            <div className={b('image-container')}>
                <img src={authorPageModel?.author?.avatarUrl} />
            </div>
            <div className={b('info-container')}>
                <h2 className={b('name')}>{name}</h2>
                <p className={b('professions')}>{professions}</p>
                <p className={b('bio')}>{authorPageModel?.author?.bio || ''}</p>
            </div>
        </section>
    );
}

function renderProductsSection(props: Props) {
    const b = bevis('author-page-products');
    const {authorPageModel} = props;

    return (
        <section className={b()}>
            <h2 className={b('title')}>Работы автора</h2>
            <Devider />
            <div className={b('products-container')}>
                <WaterfallContainer itemMaxWidth={250} minColumnGap={30} rowGap={80}>
                    {authorPageModel?.products.map((it, i) => (
                        <ProductCard
                            key={`author-product-${i}`}
                            product={{
                                ...it,
                                photo: it.photo
                            }}
                        />
                    ))}
                </WaterfallContainer>
            </div>
        </section>
    );
}

export const AuthorPage = inject(
    'userModel',
    'authorPageModel'
)(
    observer((props: Props) => {
        const {match} = props;

        useEffect(() => {
            props.authorPageModel?.load(match.params.code);
        }, []);

        return (
            <div className={b()}>
                <NavBar underline="dark" />
                {renderAuthorInfoSection(props)}
                {(props.authorPageModel?.products.length ?? 0) > 0 && renderProductsSection(props)}
                <Footer />
            </div>
        );
    })
);
