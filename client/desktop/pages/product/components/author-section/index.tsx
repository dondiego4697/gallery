import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {AboutAuthorSection} from 'desktop/components/about-author-section';
import {Skeleton} from 'desktop/components/skeleton';
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

        const title = <TitleSection title="Об авторе" isDevider={true} />;

        if (authorData.status === LoadableDataStatus.LOADING) {
            return (
                <section className={b()}>
                    {title}
                    <Skeleton
                        type="text"
                        style={{
                            marginLeft: 140,
                            marginRight: 140,
                            marginBottom: 80
                        }}
                    />
                </section>
            );
        }

        const {author} = authorData;

        return (
            <section className={b()}>
                {title}
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
