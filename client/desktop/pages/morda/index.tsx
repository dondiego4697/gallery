import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {ButtonArrowLink} from 'common/components/button-arrow-link';
import {ButtonLink} from 'common/components/button-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {MordaPageModel} from 'common/models/morda-page';
import {UserModel} from 'common/models/user';
import {NavBar} from 'desktop/components/navbar';
import {ProductCard} from 'desktop/components/product-card';

import './index.scss';

interface Props extends RouteComponentProps {
    userModel?: UserModel;
    mordaPageModel?: MordaPageModel;
}

const b = bevis('morda');

@inject('userModel', 'mordaPageModel')
@observer
export class MordaPage extends React.Component<Props> {
    public componentDidMount() {
        this.props.mordaPageModel?.load();
    }

    private renderHeader() {
        const b = bevis('morda-header');

        return (
            <div className={b()}>
                <div className={b('container')}>
                    <h1>
                        Искусство есть высочайшее
                        <br />
                        проявление могущества в человеке
                    </h1>
                    <ButtonLink text="КАТАЛОГ" to={RoutePaths.CATALOG} style="light" className={b('btn')} />
                </div>
            </div>
        );
    }

    private renderNewProducts() {
        const b = bevis('morda-new-products');

        return (
            <div className={b()}>
                <div className={b('header')}>
                    <h2>Новинки</h2>
                    <ButtonArrowLink to={RoutePaths.CATALOG} text={'Смотреть\u00a0все'} />
                </div>
                <div className={b('container')}>
                    {this.props.mordaPageModel?.products.map((it, i) => (
                        <ProductCard key={`morda-product-${i}`} src={it.photos[0]} />
                    ))}
                </div>
            </div>
        );
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <NavBar />
                {this.renderHeader()}
                <div className={b('container')}>{this.renderNewProducts()}</div>
            </div>
        );
    }
}
