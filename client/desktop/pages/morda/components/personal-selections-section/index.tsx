import * as React from 'react';

import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';
import {ButtonLink} from 'desktop/components/button-link';

import './index.scss';

const b = bevis('morda-page__personal-selections-section');

export function PersonalSelectionsSection() {
    return (
        <section className={b()}>
            <div className={b('container')}>
                <p className={b('text')}>
                    Where the spirit does not work with <br />
                    the hand there is no art
                </p>
                <ButtonLink to={RoutePaths.PERSONAL_SELECTION} text="РЕКОМЕНДАЦИИ" theme="light" className={b('btn')} />
            </div>
        </section>
    );
}
