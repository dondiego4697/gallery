import * as express from 'express';
import fileUpload from 'express-fileupload';

import {onlyAdmin} from 'app/middleware/only-admin';

import {uploadProduct} from './upload-product';

export const router = express
    .Router()
    .use(onlyAdmin)
    .use(
        fileUpload({
            uploadTimeout: 30 * 1000,
            limits: {
                fileSize: 2 * 1024 * 1024
            }
        })
    )
    .post('/upload_product', uploadProduct);
