import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {ButtonLink} from 'common/components/button-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {UserModel} from 'common/models/user';
import {NavBar} from 'desktop/components/navbar';

import './index.scss';

interface Props extends RouteComponentProps {
    userModel?: UserModel;
}

const b = bevis('morda');

@inject('userModel')
@observer
export class MordaPage extends React.Component<Props> {
    private renderHeader() {
        return (
            <div className={b('header')}>
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

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <NavBar />
                {this.renderHeader()}
            </div>
        );
    }
}
