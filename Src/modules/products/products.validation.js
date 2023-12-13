import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createProduct = joi.object({
    name: joi.string().min(3).max(25).required(),
    price: joi.number().positive().required(),
    discount: joi.number().positive().min(1),
    categoryId: generalFields.id.required(),
    subCategoryId: generalFields.id.required(),
    stock: joi.number().integer().required(),
    description: joi.string().min(2).max(150000),
    file: joi.object({
        mainImage: joi.array().items(generalFields.file.required()).length(1).required(),
        subImages: joi.array().items(generalFields.file.required()).min(2).max(4).required(),
    }),
    status: joi.string().valid('Active', 'Inactive'),
}).required();