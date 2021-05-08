import * as express from 'express';

import {main} from './main';

export const router = express.Router().get('/', main);
