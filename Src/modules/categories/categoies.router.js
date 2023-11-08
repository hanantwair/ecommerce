import { Router } from 'express';
import * as categoriesContoller from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subCategoryRouter from '../subcategory/subcategory.router.js';
import { auth } from '../../middleware/auth.js';
const router = Router();

router.use('/:id/subcategory', subCategoryRouter);
router.get('/', auth(), categoriesContoller.getCategories);
router.get('/active', categoriesContoller.getActiveCategory);
router.get('/:id', categoriesContoller.getSpecificCategory);

router.post('/', fileUpload(fileValidation.image).single('image'), categoriesContoller.createCategory);
router.patch('/:id', fileUpload(fileValidation.image).single('image'), categoriesContoller.updateCategory);

export default router;