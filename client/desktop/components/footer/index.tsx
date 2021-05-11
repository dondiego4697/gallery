import * as React from 'react';
import {Link} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';
import {Devider} from 'desktop/components/devider';

import './index.scss';

const b = bevis('footer');

export function Footer() {
    return (
        <div className={b()}>
            <div className={b('logo-container')}>
                <Link to={RoutePaths.MORDA}>Gallerian</Link>
            </div>
            <div className={b('social-container')}>
                <div className={b('social-container-wrapper')}>
                    <Link to="todoinstagram" className={b('social-item')}>
                        {SVG.Instagram}
                    </Link>
                </div>
            </div>
            <Devider />
            <p className={b('privacy')}>
                © 2021 Все права защищены. Политика в отношении обработки персональных данных.
            </p>
        </div>
    );
}
