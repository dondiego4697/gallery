import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {AboutAuthorSection} from 'desktop/components/about-author-section';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    author: {
        code: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
        bio?: string;
        professions: string[];
    };
}

const b = bevis('product-page__author-section');

export function AuthorSection(props: Props) {
    const {author} = props;

    return (
        <section className={b()}>
            <TitleSection title="Об авторе" isDevider={true} />
            <AboutAuthorSection author={author} style={{marginBottom: 80}} />
        </section>
    );
}
