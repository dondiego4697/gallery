import {Provider} from 'mobx-react';
import * as React from 'react';
import {render} from 'react-dom';
import {Router} from 'react-router-dom';

// import * as models from 'common/models';
// import {RoutesApp} from 'desktop/routes';
// import {history} from 'common/lib/history';

render(
    <div />,
    // <Provider {...models}>
    //     <>
    //         <Router history={history}>
    //             <RoutesApp />
    //         </Router>
    //     </>
    // </Provider>,
    document.getElementById('root')
);
