import * as express from 'express';
import Joi from '@hapi/joi';
import {bodyValidate} from 'app/middleware/validate';
import {filters} from './filters';
import {fullText} from './full-text';
import {dictionary} from './dictionary';

const minMaxSchema = Joi.object({
    min: Joi.number().integer().positive(),
    max: Joi.number().integer().positive()
});

const filtersSchema = Joi.object({
    limit: Joi.number().integer().positive().default(20),
    offset: Joi.number().integer().positive().default(0),
    filters: Joi.object({
        price: minMaxSchema,
        width: minMaxSchema,
        height: minMaxSchema,
        length: minMaxSchema,
        categoryCode: Joi.string(),
        selectionCode: Joi.string(),
        styleCodes: Joi.array().items(Joi.string()).default([]),
        shapeFormatCodes: Joi.array().items(Joi.string()).default([]),
        colorCodes: Joi.array().items(Joi.string()).default([])
    }).default({})
});

const fullTextSchema = Joi.object({
    query: Joi.string().required()
});

export const router = express
    .Router()
    .post('/filters', bodyValidate(filtersSchema), filters)
    .post('/full-text', bodyValidate(fullTextSchema), fullText)
    .get('/dictionary', dictionary);
