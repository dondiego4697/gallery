import cn from 'classnames';
import {startCase} from 'lodash';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    author: {
        firstName: string;
        lastName: string;
        professions: string[];
        code: string;
        avatarUrl?: string;
    };
    style?: React.CSSProperties;
    className?: string;
}

const b = bevis('author-card');

export function AuthorCard(props: Props) {
    const {author, style, className} = props;

    const fullName = `${author.firstName} ${author.lastName}`;
    const professions = startCase(author.professions.join(', ').toLowerCase());

    return (
        <div className={cn(b(), className)} style={style || {}}>
            <Link className={b('image-link')} to={RoutePaths.ARTIST.replace(':code', author.code)}>
                {/* TODO default photo */}
                <img src={author.avatarUrl} width={150} />
            </Link>
            <h3 className={b('full-name')}>{fullName}</h3>
            <p className={b('professions')}>{professions}</p>
        </div>
    );
}
