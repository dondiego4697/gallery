import Joi from '@hapi/joi';
import * as express from 'express';

import {bodyValidate} from 'app/middleware/validate';

import {login} from './login';

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().integer().positive()
});

export const router = express.Router().post('/login', bodyValidate(loginSchema), login);
