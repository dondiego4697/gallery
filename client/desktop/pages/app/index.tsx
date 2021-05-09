import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
}

const b = bevis('root');

class App extends React.Component<Props> {
    public render(): React.ReactNode {
        return <div className={b()}>{this.props.children}</div>;
    }
}

export default withRouter(App);
