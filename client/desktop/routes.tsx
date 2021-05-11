import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import {RoutePaths} from 'common/const';
import App from 'desktop/pages/app';
import {MordaPage} from 'desktop/pages/morda';

function renderRouter() {
    return (
        <Switch>
            <Route exact path={RoutePaths.MORDA} component={MordaPage} />
            <Route render={() => <Redirect to={RoutePaths.MORDA} />} />
        </Switch>
    );
}

export function RoutesApp() {
    return <App>{renderRouter()}</App>;
}
