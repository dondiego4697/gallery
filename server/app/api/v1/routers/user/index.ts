import * as express from 'express';
import {login} from './login';

export const router = express.Router().post('/login', login);
