import * as express from 'express';
import {getInfo} from './get-info';
import {getPictures} from './get-pictures';

export const router = express.Router().get('/:id/info', getInfo).get('/:id/pictures', getPictures);
