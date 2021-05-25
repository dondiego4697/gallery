import * as express from 'express';

import {getList} from './get-list';

export const router = express.Router().get('/', getList);
