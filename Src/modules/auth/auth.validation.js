import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';

export const signup = joi.object({
    userName: joi.string().min(4).max(20).required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    file: generalFields.file.required(),
});

export const signin = joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
});

export const sendCode = joi.object({
    email: generalFields.email.required(),
});

export const forgotPassword = joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
});