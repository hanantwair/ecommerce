import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createCategory = joi.object({
    name: joi.string().min(3).max(25).required(),
    file: generalFields.file.required(), //one file
    // file: joi.array().items(generalFields.file.required()).required() // multiple files
});

export const getSpecificCategory = joi.object({
    id: generalFields.id.required(),
});

export const updateCategory = joi.object({
    id: generalFields.id.required(),
    name: joi.string().min(3).max(25),
    file: generalFields.file,
});

// export const subCategoryRouter = joi.object({
//     id: generalFields.id.required(),
// });