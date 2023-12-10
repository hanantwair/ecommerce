import { Router } from "express";
import * as AuthController from './auth.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import { asyncHandler } from '../../services/errorHandling.js';
import { validation } from '../../middleware/validation.js';
import * as validators from './auth.validation.js';
const router = Router();

router.post('/signup', fileUpload(fileValidation.image).single('image'),
    validation(validators.signup), asyncHandler(AuthController.signup));
router.post('/signin', validation(validators.signin), asyncHandler(AuthController.signin));
router.get('/confirmEmail/:token', asyncHandler(AuthController.confirmEmail));
router.patch('/sendCode', validation(validators.sendCode), asyncHandler(AuthController.sendCode));
router.patch('/forgotPassword', validation(validators.forgotPassword),
    asyncHandler(AuthController.forgotPassword));
router.delete('/invalidConfirm', asyncHandler(AuthController.deleteInvalidConfirm));

export default router;