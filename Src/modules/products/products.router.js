import { Router } from 'express';
import * as productsContoller from './products.controller.js';
import { endPoint } from './products.endpoint.js';
import { auth } from '../../middleware/auth.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import { asyncHandler } from '../../services/errorHandling.js';
import { validation } from '../../middleware/validation.js';
import * as validators from './products.validation.js';
const router = Router();

router.get('/', asyncHandler(productsContoller.getProducts));
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 4 }
]), validation(validators.createProduct), asyncHandler(productsContoller.createProduct));

export default router;