import classnames from 'classnames';
import * as React from 'react';
import {useState} from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';
import {InputSearch} from 'desktop/components/input-search';

import './index.scss';

const b = bevis('navbar');

const NAV_BUTTONS = [
    [RoutePaths.MORDA, 'Главная'],
    [RoutePaths.CATALOG, 'Каталог'],
    [RoutePaths.ARTIST, 'Художники'],
    [RoutePaths.ABOUT, 'О\u00a0нас'],
    [RoutePaths.CONTACTS, 'Контакты']
];

function renderLogo() {
    return (
        <div className={b('logo-container')}>
            <Link to={RoutePaths.MORDA}>Gallerian</Link>
        </div>
    );
}

function renderMenu() {
    return (
        <ul className={b('menu-container')}>
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

function renderControls() {
    const [searchValue, setSearchValue] = useState('');

    return (
        <div className={b('controls-container')}>
            <InputSearch value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <div className={classnames(b('controls-container-icon'), b('heart'))}>
                <Link to={RoutePaths.LIKE}>{SVG.Heart}</Link>
            </div>
            <div className={classnames(b('controls-container-icon'), b('cart'))}>
                <Link to={RoutePaths.CART}>{SVG.Cart}</Link>
            </div>
        </div>
    );
}

export function NavBar() {
    return (
        <div className={b()}>
            {renderLogo()}
            {renderMenu()}
            {renderControls()}
        </div>
    );
}
