import {lowerCase, upperFirst} from 'lodash';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {Author} from 'common/request-book/morda';

import './index.scss';

interface Props {
    author: Author;
    style?: React.CSSProperties;
}

const b = bevis('author-card');

export function AuthorCard(props: Props) {
    const {author, style} = props;
    const fullName = `${author.firstName} ${author.lastName}`;

    const profession = [upperFirst(author.professions[0]), ...author.professions.slice(1).map(lowerCase)].join(', ');

    return (
        <div className={b()} style={style || {}}>
            <img src={author.avatarUrl} width={150} />
            <h3 className={b('name')}>{fullName}</h3>
            <p className={b('profession')}>{profession}</p>
        </div>
    );
}
