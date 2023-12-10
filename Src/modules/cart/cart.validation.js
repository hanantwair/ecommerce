import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createCart = joi.object({
    productId: generalFields.id.required(),
    quantity: joi.number().min(1).required(),
});

export const removeItem = joi.object({
    productId: generalFields.id.required(),
});
