import * as React from 'react';

import {ButtonLink} from 'common/components/button-link';
import {RoutePaths} from 'common/const';
import {bevis} from 'common/lib/bevis';

import './index.scss';

const b = bevis('morda-personal-selections-section');

export function PersonalSelectionsSection() {
    return (
        <section className={b()}>
            <div className={b('container')}>
                <p className={b('text')}>
                    Where the spirit does not work with <br />
                    the hand there is no art
                </p>
                <ButtonLink to={RoutePaths.PERSONAL_SELECTION} text="РЕКОМЕНДАЦИИ" style="light" className={b('btn')} />
            </div>
        </section>
    );
}
