import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {}

const b = bevis('product-author-products-section');

export function AuthorProductsSection(props: Props) {
    return <section className={b()}></section>;
}
