import {startCase} from 'lodash';
import * as React from 'react';

import {ButtonArrowLink} from 'common/components/button-arrow-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    author?: {
        firstName: string;
        lastName: string;
        avatarUrl: string;
        bio?: string;
        professions: string[];
    };
    profileLinkCode?: string;
    style?: React.CSSProperties;
}

const b = bevis('author-section');

export function AuthorSection(props: Props) {
    const {style, author, profileLinkCode} = props;

    const name = `${author?.firstName} ${author?.lastName}`;
    const professions = startCase(author?.professions.join(', ').toLowerCase());

    return (
        <section className={b()} style={style || {}}>
            <div className={b('image-container')}>
                <img src={author?.avatarUrl} />
            </div>
            <div className={b('info-container')}>
                <h2 className={b('name')}>{name}</h2>
                <p className={b('professions')}>{professions}</p>
                <p className={b('bio')}>{author?.bio || ''}</p>
                {profileLinkCode && (
                    <ButtonArrowLink
                        text="Профиль художника"
                        className={b('link')}
                        to={RoutePaths.ARTIST.replace(':code', profileLinkCode)}
                    />
                )}
            </div>
        </section>
    );
}
