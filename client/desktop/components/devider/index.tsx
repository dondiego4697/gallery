import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

const b = bevis('devider');

export class Devider extends React.Component {
    public render(): React.ReactNode {
        return <div className={b()} />;
    }
}
