import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createSubCategory = joi.object({
    name: joi.string().min(3).max(25).required(),
    file: generalFields.file.required(),
    categoryId: generalFields.id.required(),
});