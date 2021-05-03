import * as express from 'express';
import Joi from '@hapi/joi';
import {bodyValidate} from 'app/middleware/validate';
import {base} from './base';
import {fullText} from './full-text';
import {dictionary} from './dictionary';

const minMaxSchema = Joi.object({
    min: Joi.number().integer().positive(),
    max: Joi.number().integer().positive()
});

const baseSchema = Joi.object({
    limit: Joi.number().integer().positive().default(20),
    offset: Joi.number().integer().positive().default(0),
    filter: Joi.object({
        productCategoryCode: Joi.string(),
        price: minMaxSchema,
        width: minMaxSchema,
        height: minMaxSchema,
        length: minMaxSchema,
        selectionCode: Joi.string(),
        style: Joi.string(),
        shapeFormat: Joi.string()
    })
});

const fullTextSchema = Joi.object({
    query: Joi.string().required()
});

export const router = express
    .Router()
    .post('/base', bodyValidate(baseSchema), base)
    .post('/full-text', bodyValidate(fullTextSchema), fullText)
    .get('/dictionary', dictionary);
