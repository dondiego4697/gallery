import classnames from 'classnames';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {
    name?: string;
    className?: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface State {
    hideSearchIcon?: boolean;
}

const b = bevis('input-search');

export class InputSearch extends React.Component<Props, State> {
    state = {
        hideSearchIcon: (this.props.value.length ?? 0) > 0
    };

    constructor(props: Props) {
        super(props);

        this.inputOnFocusHandler = this.inputOnFocusHandler.bind(this);
        this.inputOnBlurHandler = this.inputOnBlurHandler.bind(this);
    }

    private inputOnFocusHandler() {
        this.setState({hideSearchIcon: true});
    }

    private inputOnBlurHandler() {
        this.setState({hideSearchIcon: false});
    }

    public render(): React.ReactNode {
        const {className, value, name, onChange} = this.props;

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
                            ...(this.state.hideSearchIcon || value.length > 0 ? {'force-hide': true} : {})
                        })}
                    >
                        <img src="/public/image/search-icon.svg" width="16" />
                    </div>
                    <input
                        type={'text'}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onFocus={this.inputOnFocusHandler}
                        onBlur={this.inputOnBlurHandler}
                    />
                </label>
            </div>
        );
    }
}
