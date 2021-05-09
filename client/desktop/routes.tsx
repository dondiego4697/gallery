import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import App from 'desktop/pages/app';
import {MordaPage} from 'desktop/pages/morda';

interface Props {}

export class RoutesApp extends React.Component<Props> {
    private renderRouter(): React.ReactNode {
        return (
            <Switch>
                <Route exact path={RoutePaths.MORDA} component={MordaPage} />
                <Route render={() => <Redirect to={RoutePaths.MORDA} />} />
            </Switch>
        );
    }

    public render(): React.ReactNode {
        return <App>{this.renderRouter()}</App>;
    }
}
