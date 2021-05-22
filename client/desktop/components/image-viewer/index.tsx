import cn from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    style?: React.CSSProperties;
    className?: string;
    urls: string[];
    width: number;
    height: number;
}

const b = bevis('image-viewer');

export function ImageViewer(props: Props) {
    const {className, style, urls, height, width} = props;

    const smallImageSize = 50;
    const smallImageMarginLeft = 30;
    const maxSmallImages = Math.floor(width / (smallImageSize + smallImageMarginLeft));

    const [currentUrl, setCurrentUrl] = React.useState(urls[0]);

    return (
        <div className={cn(b(), className)} style={style || {}}>
            <div
                className={b('current-image-container')}
                style={{
                    height,
                    maxWidth: width
                }}
            >
                <img src={currentUrl} height={height} />
            </div>
            <div className={b('small-images-container')}>
                <div className={b('small-images-container-wrapper')}>
                    {urls.slice(0, maxSmallImages).map((it, i) => (
                        <img
                            key={`img-viewer-${i}`}
                            src={it}
                            width={smallImageSize}
                            height={smallImageSize}
                            style={{
                                marginLeft: i === 0 ? 0 : smallImageMarginLeft
                            }}
                            className={cn({
                                ['active']: currentUrl === it
                            })}
                            onClick={() => setCurrentUrl(it)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
