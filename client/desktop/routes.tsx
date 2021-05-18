import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

import {RoutePaths} from 'common/const';

import App from './pages/app';
import {AuthorPage} from './pages/author-page';
import {MordaPage} from './pages/morda';
import {ProductPage} from './pages/product';

function renderRouter() {
    return (
        <Switch>
            <Route exact path={RoutePaths.MORDA} component={MordaPage} />
            <Route exact path={RoutePaths.ARTIST} component={AuthorPage} />
            <Route exact path={RoutePaths.PRODUCT} component={ProductPage} />
            <Route render={() => <Redirect to={RoutePaths.MORDA} />} />
        </Switch>
    );
}

export function RoutesApp() {
    return <App>{renderRouter()}</App>;
}
