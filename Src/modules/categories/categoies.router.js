import { Router } from 'express';
import * as categoriesContoller from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subCategoryRouter from '../subcategory/subcategory.router.js';
import { auth } from '../../middleware/auth.js';
import { endPoint } from './categories.endpoint.js';
import { asyncHandler } from '../../services/errorHandling.js'
import { validation } from '../../middleware/validation.js';
import * as validators from './categories.validation.js';
const router = Router();

router.use('/:id/subcategory', subCategoryRouter);
router.post('/', asyncHandler(auth(endPoint.create)), fileUpload(fileValidation.image).single('image'),
    validation(validators.createCategory), asyncHandler(categoriesContoller.createCategory));
router.get('/', asyncHandler(auth(endPoint.getAll)), asyncHandler(categoriesContoller.getCategories));
router.get('/active', asyncHandler(auth(endPoint.getActive)), asyncHandler(categoriesContoller.getActiveCategory));
router.get('/:id', asyncHandler(auth(endPoint.spesific)), validation(validators.getSpecificCategory),
    asyncHandler(categoriesContoller.getSpecificCategory));
router.patch('/:id', asyncHandler(auth(endPoint.update)), fileUpload(fileValidation.image).single('image'),
    validation(validators.updateCategory), asyncHandler(categoriesContoller.updateCategory));

export default router;