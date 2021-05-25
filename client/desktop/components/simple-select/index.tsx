import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

interface Props {
    style?: React.CSSProperties;
    className?: string;
    defaultCode?: string;
    placeholder: string;
    items: {
        code: string;
        value: string;
    }[];
    onChange: (value: string) => void;
}

const b = bevis('simple-select');

export function SimpleSelect(props: Props) {
    const {style, className, items, defaultCode, placeholder, onChange} = props;

    const [show, setShow] = React.useState(false);
    const [selectedCode, setSelectedCode] = React.useState(defaultCode);
    const selectedValue = items.find((it) => it.code === selectedCode)?.value;

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
                            [b('option_selected')]: it.code === selectedCode
                        })}
                        key={`select-option-${i}`}
                        onMouseDown={() => {
                            onChange(it.code);
                            setSelectedCode(it.code);
                        }}
                    >
                        {it.value}
                    </option>
                ))}
            </div>
        </div>
    );
}
