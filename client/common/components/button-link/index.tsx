import classnames from 'classnames';
import * as React from 'react';
import {Link} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    text: string;
    to: string;
    style: 'light' | 'dark';
    className?: string;
}

const b = bevis('btn-link');

export class ButtonLink extends React.Component<Props> {
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
                    <div>{text}</div>
                </Link>
            </div>
        );
    }
}