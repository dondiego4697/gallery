import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {}

const b = bevis('product-author-section');

export function AuthorSection(props: Props) {
    return <section className={b()}></section>;
}
