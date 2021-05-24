import {ProductGetInfoResponse} from '@server-types/response';
import {meta} from 'eslint/lib/rules/*';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {LoadableDataStatus, RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ProductPageModel} from 'common/models/product-page';
import {SVG} from 'common/svg';
import {stringifyPrice} from 'common/utils/price';
import {Button, LikeButton, ShareButton} from 'desktop/components/button';
import {Devider} from 'desktop/components/devider';
import {ImageViewer} from 'desktop/components/image-viewer';
import {Skeleton} from 'desktop/components/skeleton';

import './index.scss';

interface Props {
    productPageModel?: ProductPageModel;
}

const b = bevis('product-page__content-section');

function makeProductParameter(
    product: ProductGetInfoResponse.Product,
    meta: ProductGetInfoResponse.Meta,
    author: ProductGetInfoResponse.Author
) {
    return [
        `Автор: ${author.firstName} ${author.lastName}`,
        `Размер: ${[product.size.width, product.size.height, product.size.length].filter(Boolean).join(' × ')} см`,
        product.material ? `Материал: ${product.material.name}` : undefined,
        `Категория: ${product.category.name}`,
        product.releaseYear ? `Год: ${product.releaseYear}` : undefined,
        <p className={b('views')}>
            {SVG.Eye} {meta.views}
        </p>
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
            return (
                <section className={b()}>
                    <Skeleton style={{width: 1200, margin: 'auto'}} />
                </section>
            );
        }

        const {product, author, meta} = productData;

        const parameters = makeProductParameter(product, meta, author);

        const photos = [product.defaultPhoto, ...product.photos].filter(Boolean) as string[];

        return (
            <section className={b()}>
                <div className={b('wrapper')}>
                    <div className={b('image-container')}>
                        <ImageViewer style={{margin: 'auto'}} urls={photos} height={500} width={500} />
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
                                <div key={`product-page-parameters-${i}`} className={b('parameter-item')}>
                                    {it}
                                </div>
                            ))}
                        </div>
                        <p className={b('price')}>{stringifyPrice(product.price)}</p>
                        <div className={b('control-container')}>
                            <Button
                                onClick={() => {}}
                                theme="dark"
                                text="КУПИТЬ"
                                style={{gridColumnStart: 1, gridColumnEnd: 3}}
                            />
                            <LikeButton onClick={() => productPageModel.like()} theme="light" isLike={meta.isLike} />
                            <ShareButton onClick={() => {}} theme="light" />
                        </div>
                    </div>
                </div>
            </section>
        );
    })
);
