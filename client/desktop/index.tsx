import {Provider} from 'mobx-react';
import * as React from 'react';
import {render} from 'react-dom';
import {Route, Router} from 'react-router-dom';
import {QueryParamProvider} from 'use-query-params';

import {history} from 'common/lib/history';
import * as models from 'common/models';
import {RoutesApp} from 'desktop/routes';

render(
    <Provider {...models}>
        <>
            <Router history={history}>
                <QueryParamProvider ReactRouterRoute={Route}>
                    <RoutesApp />
                </QueryParamProvider>
            </Router>
        </>
    </Provider>,
    document.getElementById('root')
);
