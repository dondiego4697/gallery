import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    src: string;
}

const b = bevis('product-card');

export class ProductCard extends React.Component<Props> {
    public render(): React.ReactNode {
        const {src} = this.props;

        return (
            <div className={b()}>
                <img src={src} width={250} />
            </div>
        );
    }
}
