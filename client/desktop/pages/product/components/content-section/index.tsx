import {ProductGetInfoResponse} from '@server-types/response';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {LoadableDataStatus, RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {stringifyPrice} from 'common/utils/price';
import {Devider} from 'desktop/components/devider';
import {ImageViewer} from 'desktop/components/image-viewer';

import './index.scss';

interface Props {
    productPageModel?: ProductPageModel;
}

const b = bevis('product-page__content-section');

function makeProductParameter(product: ProductGetInfoResponse.Product, author: ProductGetInfoResponse.Author) {
    return [
        `Автор: ${author.firstName} ${author.lastName}`,
        `Размер: ${[product.size.width, product.size.height, product.size.length].filter(Boolean).join(' × ')} см`,
        product.material ? `Материал: ${product.material.name}` : undefined,
        `Категория: ${product.category.name}`,
        product.releaseYear ? `Год: ${product.releaseYear}` : undefined
    ].filter(Boolean);
}

export const ContentSection = inject('productPageModel')(
    observer((props: Props) => {
        const {productPageModel} = props;

        if (!productPageModel) {
            return <div />;
        }

        const {product: productData} = productPageModel;

        if (productData.status === LoadableDataStatus.LOADING) {
            return <div />;
        }

        const {product, author} = productData;

        const parameters = makeProductParameter(product, author);

        return (
            <section className={b()}>
                <div className={b('image-container')}>
                    <ImageViewer style={{margin: 'auto'}} urls={product.photos} align="center" />
                </div>
                <div className={b('info-container')}>
                    <div className={b('title-container')}>
                        <h2>{product.name}</h2>
                        <Link to={RoutePaths.ARTIST.replace(':code', author.code)}>
                            <img src={author.avatarUrl} />
                        </Link>
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
    })
);
