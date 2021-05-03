import * as express from 'express';
import Joi from '@hapi/joi';
import {getList} from './get-list';
import {getInfo} from './get-info';
import {queryValidate} from 'app/middleware/validate';

const infoSchema = Joi.object({
    poor: Joi.boolean().default(false)
});

const listSchema = Joi.object({
    limit: Joi.number().integer().positive().default(20),
    offset: Joi.number().integer().positive().default(0),
    searchFirstLetter: Joi.string().length(1),
    searchQuery: Joi.string()
});

export const router = express
    .Router()
    .get('/', queryValidate(listSchema), getList)
    .get('/:code/info', queryValidate(infoSchema), getInfo);
