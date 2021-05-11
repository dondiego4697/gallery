import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

const b = bevis('devider');

export function Devider() {
    return <div className={b()} />;
}
