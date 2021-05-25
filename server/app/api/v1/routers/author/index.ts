import Joi from '@hapi/joi';
import * as express from 'express';

import {queryValidate} from 'app/middleware/validate';

import {getInfo} from './get-info';
import {getList} from './get-list';

const listSchema = Joi.object({
    limit: Joi.number().integer().positive().default(20),
    offset: Joi.number().integer().positive().allow(0).default(0),
    searchFirstLetter: Joi.string().length(1),
    searchQuery: Joi.string(),
    professionCode: Joi.string()
});

export const router = express.Router().get('/', queryValidate(listSchema), getList).get('/:code/info', getInfo);
