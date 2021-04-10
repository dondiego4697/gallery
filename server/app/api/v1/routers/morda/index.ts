import * as express from 'express';
import {getInfo} from './get-info';

export const router = express.Router().get('/', getInfo);
