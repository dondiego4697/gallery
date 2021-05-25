import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

const b = bevis('author-list-page__header-section');

export function HeaderSection() {
    return (
        <section className={b()}>
            <div className={b('banner')}>
                <h1>
                    Раскрыть людям себя и скрыть художника – <br /> вот к чему стремится искусство
                </h1>
            </div>
        </section>
    );
}
