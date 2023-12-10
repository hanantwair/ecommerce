import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createProduct = joi.object({
    name: joi.string().min(3).max(25).required(),
    // file: joi.fields().items(generalFields.file.required()).required(),
    price: joi.number().required(),
    discount: joi.number(),
    categoryId: generalFields.id.required(),
    subCategoryId: generalFields.id.required(),
});