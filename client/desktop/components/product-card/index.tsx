import cn from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {ButtonArrowLink} from 'common/components/button-arrow-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';
import {stringifyPrice} from 'common/utils/price';
import {Devider} from 'desktop/components/devider';

import './index.scss';

export interface Product {
    code: string;
    name: string;
    price: number;
    releaseYear?: number;
    photo?: string;
    size: {
        width: number;
        height: number;
        length?: number;
    };
    meta: {
        views: number;
        isLike: boolean;
    };
    author?: {
        firstName: string;
        lastName: string;
    };
}

interface Props {
    product: Product;
    style?: React.CSSProperties;
}

const b = bevis('product-card');

function likeHandler() {
    // TODO логика лайка
}

export function ProductCard(props: Props) {
    const {product, style} = props;
    const {author, size, meta} = product;

    const [isLike, setLike] = React.useState(meta.isLike);

    const authorLine = (author
        ? [`${author.firstName} ${author.lastName}`, product.releaseYear ? `, ${product.releaseYear}` : undefined]
        : []
    )
        .filter(Boolean)
        .join('');
    const sizeLine = [size.width, size.height, size.length].filter(Boolean).join(' x ');
    const price = stringifyPrice(product.price);
    const to = RoutePaths.PRODUCT.replace(':code', product.code);

    return (
        <div className={b()} style={style || {}}>
            <Link to={to}>
                <img src={product.photo} width={250} />
            </Link>
            <div className={b('title-container')}>
                <h2>{product.name}</h2>
                <div
                    className={cn({
                        [b('heart-container')]: true,
                        [b('heart-container_liked')]: isLike
                    })}
                    onClick={() => {
                        setLike(!isLike);
                        likeHandler();
                    }}
                >
                    {SVG.FilledHeart}
                </div>
            </div>
            <div className={b('description-container')}>
                <p>{authorLine}</p>
                <p>{sizeLine}</p>
            </div>
            <Devider />
            <div className={b('price-container')}>
                <p>{price}</p>
                <ButtonArrowLink to={to} />
            </div>
        </div>
    );
}
