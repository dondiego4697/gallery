import classnames from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

interface Props {
    name?: string;
    className?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const b = bevis('input-search');

export function InputSearch(props: Props) {
    const {className, value, name, onChange} = props;
    const [hideSearchIcon, setHideSearchIcon] = React.useState((props.value.length ?? 0) > 0);

    return (
        <div
            className={classnames({
                [b()]: true,
                ...(className ? {[className]: true} : {})
            })}
        >
            <label>
                <div
                    className={classnames({
                        [b('search-icon-container')]: true,
                        ...(hideSearchIcon || value.length > 0 ? {'force-hide': true} : {})
                    })}
                >
                    {SVG.Search}
                </div>
                <input
                    type={'text'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setHideSearchIcon(true)}
                    onBlur={() => setHideSearchIcon(false)}
                />
            </label>
        </div>
    );
}
