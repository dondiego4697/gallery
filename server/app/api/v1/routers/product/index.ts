import * as express from 'express';

import {getInfo} from './get-info';
import {like} from './like';
import {view} from './view';

export const router = express.Router().get('/:code/info', getInfo).put('/:code/view', view).put('/:code/like', like);
