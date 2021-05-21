import cn from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';
import {InputSearch} from 'desktop/components/input-search';

import './index.scss';

interface Props {
    underline: 'dark' | 'light';
    currentPath: string;
}

const b = bevis('navbar');

const NAV_BUTTONS = [
    [RoutePaths.MORDA, 'Главная'],
    [RoutePaths.CATALOG, 'Каталог'],
    [RoutePaths.ARTISTS, 'Художники'],
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

function renderMenu(props: Props) {
    const {underline, currentPath} = props;

    return (
        <ul className={cn(b('menu-container'), underline)}>
            {NAV_BUTTONS.map((it, i) => (
                <li
                    key={`nav-btn-${i}`}
                    className={cn({
                        ['active']: it[0] === currentPath
                    })}
                >
                    <Link to={it[0]}>
                        <div>{it[1]}</div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

function renderControls() {
    const [searchValue, setSearchValue] = React.useState('');

    return (
        <div className={b('controls-container')}>
            <InputSearch value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
            <div className={cn(b('controls-container-icon'), b('heart'))}>
                <Link to={RoutePaths.LIKE}>{SVG.Heart}</Link>
            </div>
            <div className={cn(b('controls-container-icon'), b('cart'))}>
                <Link to={RoutePaths.CART}>{SVG.Cart}</Link>
            </div>
        </div>
    );
}

export function NavBar(props: Props) {
    return (
        <div className={b()}>
            <div className={b('wrapper')}>
                {renderLogo()}
                {renderMenu(props)}
                {renderControls()}
            </div>
        </div>
    );
}
