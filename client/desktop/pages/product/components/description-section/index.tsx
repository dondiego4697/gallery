import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {}

const b = bevis('product-description-section');

export function DescriptionSection(props: Props) {
    return <section className={b()}></section>;
}
