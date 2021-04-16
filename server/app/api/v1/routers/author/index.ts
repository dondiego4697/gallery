import * as express from 'express';
import Joi from '@hapi/joi';
import {getInfo} from './get-info';
import {getPictures} from './get-pictures';
import {queryValidate} from 'app/middleware/validate';

const picturesSchema = Joi.object({
    limit: Joi.number().integer().positive().default(20),
    offset: Joi.number().integer().positive().default(0)
});

export const router = express
    .Router()
    .get('/:id/info', getInfo)
    .get('/:id/pictures', queryValidate(picturesSchema), getPictures);
