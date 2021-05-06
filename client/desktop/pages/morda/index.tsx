import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';

import {bevis} from 'common/lib/bevis';
import {UserModel} from 'common/models/user';
import {NavBar} from 'desktop/components/navbar';

import './index.scss';

interface Props extends RouteComponentProps {
    userModel?: UserModel;
}

const b = bevis('morda');

@inject('userModel')
@observer
export class MordaPage extends React.Component<Props> {
    state = {};

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <NavBar />
            </div>
        );
    }
}
