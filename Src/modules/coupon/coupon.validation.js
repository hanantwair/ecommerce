import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const createCoupon = joi.object({
    name: joi.string().min(3).max(24).required(),
    amount: joi.number().min(1).required(),
});

export const updateCoupon = joi.object({
    id: generalFields.id.required(),
    name: joi.string().min(3).max(24),
    amount: joi.number().min(1),
});

export const check_id = joi.object({
    id: generalFields.id.required(),
});
