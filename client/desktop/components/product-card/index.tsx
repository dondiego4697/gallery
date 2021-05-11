import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {Product} from 'common/request-book/morda';

import './index.scss';

interface Props {
    product: Product;
    style?: React.CSSProperties;
}

const b = bevis('product-card');

export function ProductCard(props: Props) {
    const {product, style} = props;

    return (
        <div className={b()} style={style || {}}>
            <img src={product.photos[0]} width={250} />
            <div className={b('title-container')}>
                <h2>{product.name}</h2>
            </div>
        </div>
    );
}
