import cn from 'classnames';
import {startCase} from 'lodash';
import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ButtonArrowLink} from 'desktop/components/button-arrow-link';

import './index.scss';

interface Props {
    author: {
        code?: string;
        firstName: string;
        lastName: string;
        professions: string[];
        avatarUrl?: string;
        bio?: string;
    };
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('about-author-section');

export function AboutAuthorSection(props: Props) {
    const {style, author, className} = props;

    const name = `${author.firstName} ${author.lastName}`;
    const professions = startCase(author.professions.join(', ').toLowerCase());

    return (
        <section className={cn(b(), className)} style={style || {}}>
            <div className={b('wrapper')}>
                <div className={b('image-container')}>
                    {/* TODO default image */}
                    <img src={author.avatarUrl} />
                </div>
                <div className={b('info-container')}>
                    <h2 className={b('name')}>{name}</h2>
                    <p className={b('professions')}>{professions}</p>
                    {author.bio && <p className={b('bio')}>{author.bio}</p>}
                    {author.code && (
                        <ButtonArrowLink
                            text="Профиль художника"
                            className={b('link')}
                            to={RoutePaths.ARTIST.replace(':code', author.code)}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
