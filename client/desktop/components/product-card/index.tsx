import classnames from 'classnames';
import * as React from 'react';

import {ButtonArrowLink} from 'common/components/button-arrow-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';
import {stringifyPrice} from 'common/utils/price';
import {Devider} from 'desktop/components/devider';

import './index.scss';

interface Props {
    product: {
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
    };
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

    return (
        <div className={b()} style={style || {}}>
            <img src={product.photo} width={250} />
            <div className={b('title-container')}>
                <h2>{product.name}</h2>
                <div
                    className={classnames({
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
                <ButtonArrowLink to={RoutePaths.PRODUCT.replace(':code', product.code)} />
            </div>
        </div>
    );
}
