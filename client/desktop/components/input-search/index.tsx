import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

interface Props {
    name?: string;
    className?: string;
    style?: React.CSSProperties;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const b = bevis('input-search');

export function InputSearch(props: Props) {
    const {className, value, name, onChange, style} = props;
    const [hideSearchIcon, setHideSearchIcon] = React.useState((props.value.length ?? 0) > 0);

    return (
        <div className={cn(b(), className)} style={style || {}}>
            <label className={b('container')}>
                <div
                    className={cn({
                        [b('search-icon-container')]: true,
                        ...(hideSearchIcon || value.length > 0 ? {'force-hide': true} : {})
                    })}
                >
                    {SVG.Search}
                </div>
                <input
                    className={b('input')}
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
