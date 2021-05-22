import Joi from '@hapi/joi';
import * as express from 'express';

import {queryValidate} from 'app/middleware/validate';

import {getRandomInteriors} from './get-random-interiors';

const randomSchema = Joi.object({
    limit: Joi.number().integer().positive().default(3)
});

export const router = express.Router().get('/random', queryValidate(randomSchema), getRandomInteriors);
