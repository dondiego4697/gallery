import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props extends RouteComponentProps {
    children: React.ReactNode;
}

const b = bevis('root');

function App(props: Props) {
    const {children, history} = props;

    React.useEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });

        return () => unlisten();
    }, []);

    return <div className={b()}>{children}</div>;
}

export default withRouter(App);
