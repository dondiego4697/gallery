import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
}

const b = bevis('root');

function App(props: Props) {
    return <div className={b()}>{props.children}</div>;
}

export default withRouter(App);
