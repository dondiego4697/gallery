import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import MobileDetect from 'mobile-detect';

export const renderHTML = wrap<Request, Response>(async (req, res) => {
    const mobileDetect = new MobileDetect(req.headers['user-agent'] || '');
    const deviceType = mobileDetect.mobile() ? 'touch' : 'desktop';

    const clientData = JSON.stringify({});

    res.render(deviceType, {
        config: {
            bundleJsPath: `/public/bundles/${deviceType}.bundle.js`
        },
        clientData
    });
});
