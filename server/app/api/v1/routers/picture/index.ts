import * as express from 'express';
import {getInfo} from './get-info';
import {like} from './like';
import {view} from './view';

export const router = express.Router().get('/:id/info', getInfo).put('/like', like).put('/view', view);
