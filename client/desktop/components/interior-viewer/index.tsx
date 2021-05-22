import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Interior {
    photoUrl: string;
    x: number;
    y: number;
    maxPictureHeight: number;
    maxPictureWidth: number;
}

interface Props {
    style?: React.CSSProperties;
    className?: string;
    productUrl: string;
    height: number;
    interior: Interior;
}

const b = bevis('interior-viewer');

const renderImage = (productUrl: string, interior: Interior, maxHeight: number) => {
    const productImage = new Image();
    const interiorImage = new Image();

    const [productW, setProductWidth] = React.useState(0);
    const [productH, setProductHeight] = React.useState(0);
    const [productTop, setProductTop] = React.useState(0);
    const [productLeft, setProductLeft] = React.useState(0);

    const [interiorW, setInteriorWidth] = React.useState(0);
    const [interiorH, setInteriorHeight] = React.useState(0);
    const [changeRatio, setChangeRatio] = React.useState(1);

    productImage.onload = () => {
        const {x, y, maxPictureHeight, maxPictureWidth} = interior;
        const {width: origW, height: origH} = productImage;

        const origRatio = origW / origH;

        const maxW = Math.min(origW, maxPictureWidth);
        const maxH = Math.min(origH, maxPictureHeight);

        let h = maxW / origRatio;
        let w = h * origRatio;

        if (h > maxH) {
            h = maxH;
            w = maxH * origRatio;
        }

        setProductWidth(w / changeRatio);
        setProductHeight(h / changeRatio);

        setProductTop(y / changeRatio);
        setProductLeft(x / changeRatio);
    };

    interiorImage.onload = () => {
        const interiorOrigRatio = interiorImage.width / interiorImage.height;
        const interiorH = Math.min(interiorImage.height, maxHeight);
        const interiorW = interiorH * interiorOrigRatio;

        setInteriorWidth(interiorW);
        setInteriorHeight(interiorH);

        setChangeRatio(interiorImage.width / interiorW);
    };

    interiorImage.src = interior.photoUrl;
    productImage.src = productUrl;

    return (
        <div className={b('image-container')}>
            <img
                src={productUrl}
                width={productW}
                height={productH}
                style={{
                    position: 'absolute',
                    top: productTop,
                    left: productLeft
                }}
                className={b('product-image')}
            />
            <img src={interior.photoUrl} width={interiorW} height={interiorH} />
        </div>
    );
};

export function InteriorViewer(props: Props) {
    const {style, className, productUrl, interior, height} = props;

    return (
        <div className={cn(b(), className)} style={style || {}}>
            {renderImage(productUrl, interior, height)}
        </div>
    );
}
