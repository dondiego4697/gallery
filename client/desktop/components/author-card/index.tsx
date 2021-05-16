import {lowerCase, upperFirst} from 'lodash';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    firstName: string;
    lastName: string;
    professions: string[];
    code: string;
    avatarUrl: string;
    style?: React.CSSProperties;
}

const b = bevis('author-card');

export function AuthorCard(props: Props) {
    const {firstName, lastName, professions, avatarUrl, code, style} = props;
    const fullName = `${firstName} ${lastName}`;

    const profession = [upperFirst(professions[0]), ...professions.slice(1).map(lowerCase)].join(', ');

    return (
        <div className={b()} style={style || {}}>
            <Link to={RoutePaths.ARTIST.replace(':code', code)}>
                <img src={avatarUrl} width={150} />
            </Link>
            <h3 className={b('name')}>{fullName}</h3>
            <p className={b('profession')}>{profession}</p>
        </div>
    );
}
