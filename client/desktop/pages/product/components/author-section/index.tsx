import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {AuthorSection as AuthorSectionComponent} from 'desktop/components/author-section';
import {HeaderSection} from 'desktop/components/header-section';

import './index.scss';

interface Props {
    author: {
        code: string;
        firstName: string;
        lastName: string;
        avatarUrl: string;
        bio?: string;
        professions: string[];
    };
}

const b = bevis('product-author-section');

export function AuthorSection(props: Props) {
    const {author} = props;

    return (
        <section className={b()}>
            <HeaderSection title="Об авторе" isDevider={true} />
            <AuthorSectionComponent profileLinkCode={author.code} author={author} />
        </section>
    );
}
