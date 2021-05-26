import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

interface Props {
    style?: React.CSSProperties;
    className?: string;
    defaultKey?: string;
    placeholder: string;
    items: {
        key: string;
        value: string;
    }[];
    onKeyChange: (value: string) => void;
}

const b = bevis('simple-select');

export function SimpleSelect(props: Props) {
    const {style, className, items, defaultKey, placeholder, onKeyChange} = props;

    const [show, setShow] = React.useState(false);
    const [selectedKey, setSelectedKey] = React.useState(defaultKey);
    const selectedValue = items.find((it) => it.key === selectedKey)?.value;

    return (
        <div className={cn(b(), className)} style={style || {}}>
            <div className={b('input-container')}>
                <input
                    type="checkbox"
                    checked={show}
                    onChange={(event) => setShow(event.target.checked)}
                    onBlur={() => setShow(false)}
                />
                <div
                    className={cn({
                        [b('placeholder')]: true,
                        [b('placeholder_active')]: show
                    })}
                >
                    <span>{selectedValue || placeholder}</span>
                    {SVG.Chevron}
                </div>
            </div>
            <div
                className={cn({
                    [b('options-container')]: true,
                    [b('options-container_visible')]: show
                })}
            >
                {items.map((it, i) => (
                    <option
                        className={cn({
                            [b('option')]: true,
                            [b('option_selected')]: it.key === selectedKey
                        })}
                        key={`select-option-${i}`}
                        onMouseDown={() => {
                            onKeyChange(it.key);
                            setSelectedKey(it.key);
                        }}
                    >
                        {it.value}
                    </option>
                ))}
            </div>
        </div>
    );
}
