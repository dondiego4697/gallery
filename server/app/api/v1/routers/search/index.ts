import * as express from 'express';
import {baseSearch} from './base-search';

export const router = express
    .Router()
    // Поиск по всем картинам
    // Фильтры {price: [], style: [], shape: [], size: {w: [], h: []}}
    // Неявная сортировка: лайк + просмотр + свежесть публикации
    // Пагинация
    .get('/base', baseSearch);
