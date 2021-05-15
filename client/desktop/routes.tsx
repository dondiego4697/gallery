import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import {RoutePaths} from 'common/const';

import App from './pages/app';
import {AuthorPage} from './pages/author';
import {MordaPage} from './pages/morda';

function renderRouter() {
    return (
        <Switch>
            <Route exact path={RoutePaths.MORDA} component={MordaPage} />
            <Route exact path={RoutePaths.ARTIST} component={AuthorPage} />
            <Route render={() => <Redirect to={RoutePaths.MORDA} />} />
        </Switch>
    );
}

export function RoutesApp() {
    return <App>{renderRouter()}</App>;
}
