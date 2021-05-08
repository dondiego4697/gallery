import classnames from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

interface Props {
    to: string;
    text?: string;
    className?: string;
}

const b = bevis('btn-arrow-link');

export class ButtonArrowLink extends React.Component<Props> {
    public render(): React.ReactNode {
        const {to, text, className} = this.props;

        return (
            <div
                className={classnames({
                    [b()]: true,
                    ...(className ? {[className]: true} : {})
                })}
            >
                <Link to={to}>
                    {text || ''}
                    {SVG.Arrow}
                </Link>
            </div>
        );
    }
}
