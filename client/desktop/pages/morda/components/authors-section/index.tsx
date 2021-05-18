import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {AuthorCard} from 'desktop/components/author-card';
import {TitleSection} from 'desktop/components/title-section';

import './index.scss';

interface Props {
    authors: {
        firstName: string;
        lastName: string;
        professions: string[];
        code: string;
        avatarUrl?: string;
    }[];
}

const b = bevis('morda-page__authors-section');

export function AuthorsSection(props: Props) {
    const {authors} = props;

    return (
        <section className={b()}>
            <TitleSection
                title="Художники"
                description="Where the spirit does not work with the hand there is no art"
                to={RoutePaths.ARTISTS}
            />
            <div className={b('container')}>
                {authors.map((it, i) => (
                    <AuthorCard key={`morda-author-${i}`} author={it} />
                ))}
            </div>
        </section>
    );
}
