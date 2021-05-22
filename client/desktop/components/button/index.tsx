import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {SVG} from 'common/svg';

import './index.scss';

interface Props {
    text: string;
    onClick: () => void;
    theme: 'light' | 'dark';
    style?: React.CSSProperties;
    className?: string;
    icon?: JSX.Element;
}

export function Button(props: Props) {
    const b = bevis('btn');

    const {onClick, text, className, theme, style, icon} = props;

    return (
        <div className={cn(b(), b(theme), className)} style={style || {}}>
            <div onClick={onClick} className={b('btn-control')}>
                <div className={b('text-container')}>
                    {text}
                    {icon}
                </div>
            </div>
        </div>
    );
}

export function LikeButton(props: Omit<Props, 'icon' | 'text'> & {isLike: boolean}) {
    const b = bevis('btn-like');

    return (
        <Button
            {...props}
            text="НРАВИТСЯ"
            icon={SVG.FilledHeart}
            className={cn({
                [b()]: true,
                liked: props.isLike
            })}
        />
    );
}

export function ShareButton(props: Omit<Props, 'icon' | 'text'>) {
    return <Button {...props} text="ПОДЕЛИТЬСЯ" icon={SVG.Share} />;
}
