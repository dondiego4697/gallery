import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {AboutAuthorSection} from 'desktop/components/about-author-section';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    productPageModel?: ProductPageModel;
}

const b = bevis('product-page__author-section');

export const AuthorSection = inject('productPageModel')(
    observer((props: Props) => {
        const {productPageModel} = props;

        if (!productPageModel) {
            return <div />;
        }

        const {author: authorData} = productPageModel;

        if (authorData.status === LoadableDataStatus.LOADING) {
            return <div />;
        }

        const {author} = authorData;

        return (
            <section className={b()}>
                <TitleSection title="Об авторе" isDevider={true} />
                <AboutAuthorSection
                    author={{
                        code: author.code,
                        firstName: author.firstName,
                        lastName: author.lastName,
                        professions: author.professions,
                        avatarUrl: author.avatarUrl,
                        bio: author.bio
                    }}
                    style={{marginBottom: 80}}
                />
            </section>
        );
    })
);
