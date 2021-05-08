import classnames from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';
import {InputSearch} from 'desktop/components/input-search';

import './index.scss';

interface Props {}

interface State {
    searchValue: string;
}

const b = bevis('navbar');

const NAV_BUTTONS = [
    [RoutePaths.MORDA, 'Главная'],
    [RoutePaths.CATALOG, 'Каталог'],
    [RoutePaths.ARTIST, 'Художники'],
    [RoutePaths.ABOUT, 'О нас'],
    [RoutePaths.CONTACTS, 'Контакты']
];

export class NavBar extends React.Component<Props, State> {
    state: State = {
        searchValue: ''
    };

    constructor(props: Props) {
        super(props);

        this.inputSearchChangeHandler = this.inputSearchChangeHandler.bind(this);
    }

    private inputSearchChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({searchValue: event.target.value});
    }

    private renderLogo() {
        return (
            <div className={b('logo')}>
                <Link to={RoutePaths.MORDA}>Gallerian</Link>
            </div>
        );
    }

    private renderMenu() {
        return (
            <ul>
                {NAV_BUTTONS.map((it, i) => (
                    <li key={`nav-btn-${i}`}>
                        <Link to={it[0]}>
                            <div>{it[1]}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    private renderControls() {
        return (
            <div className={b('controls')}>
                <InputSearch value={this.state.searchValue} onChange={this.inputSearchChangeHandler} />
                <div className={classnames(b('icon-control-container'), b('heart'))}>
                    <Link to={RoutePaths.LIKE}>{SVG.Heart}</Link>
                </div>
                <div className={classnames(b('icon-control-container'), b('cart'))}>
                    <Link to={RoutePaths.CART}>{SVG.Cart}</Link>
                </div>
            </div>
        );
    }

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                {this.renderLogo()}
                {this.renderMenu()}
                {this.renderControls()}
            </div>
        );
    }
}
