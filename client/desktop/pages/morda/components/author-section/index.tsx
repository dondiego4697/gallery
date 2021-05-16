import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {AuthorCard} from 'desktop/components/author-card';
import {HeaderSection} from 'desktop/components/header-section';

import './index.scss';

interface Props {
    authors: {
        firstName: string;
        lastName: string;
        professions: string[];
        code: string;
        avatarUrl: string;
    }[];
}

const b = bevis('morda-author-section');

export function AuthorSection(props: Props) {
    const {authors} = props;

    return (
        <section className={b()}>
            <HeaderSection
                title="Художники"
                description="Where the spirit does not work with the hand there is no art"
                to={RoutePaths.ARTISTS}
            />
            <div className={b('container')}>
                {authors.map((it, i) => (
                    <AuthorCard key={`morda-author-${i}`} {...it} />
                ))}
            </div>
        </section>
    );
}
