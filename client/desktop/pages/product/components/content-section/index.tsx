import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {ProductGetInfoResponse} from 'common/request-book/product';
import {stringifyPrice} from 'common/utils/price';
import {Devider} from 'desktop/components/devider';

import './index.scss';

interface Props {
    product: ProductGetInfoResponse.Product;
    author: ProductGetInfoResponse.Author;
}

const b = bevis('product-page__content-section');

function makeProductParameter(props: Props) {
    const {product, author} = props;

    return [
        `Автор: ${author.firstName} ${author.lastName}`,
        `Размер: ${[product.size.width, product.size.height, product.size.length].filter(Boolean).join(' × ')} см`,
        product.material ? `Материал: ${product.material.name}` : undefined,
        `Категория: ${product.category.name}`,
        product.releaseYear ? `Год: ${product.releaseYear}` : undefined
    ].filter(Boolean);
}

export function ContentSection(props: Props) {
    const {product, author} = props;

    const parameters = makeProductParameter(props);

    return (
        <section className={b()}>
            <div className={b('image-container')}>
                <img src={product.photos[0]} />
            </div>
            <div className={b('info-container')}>
                <div className={b('title-container')}>
                    <h2>{product.name}</h2>
                    <img src={author.avatarUrl} />
                </div>
                <Devider />
                <div className={b('parameters-container')}>
                    {parameters.map((it, i) => (
                        <p key={`product-page-parameters-${i}`}>{it}</p>
                    ))}
                </div>
                <p className={b('price')}>{stringifyPrice(product.price)}</p>
            </div>
        </section>
    );
}
