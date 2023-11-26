import { Router } from 'express';
import * as categoriesContoller from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subCategoryRouter from '../subcategory/subcategory.router.js';
import { auth } from '../../middleware/auth.js';
import { endPoint } from './categories.endpoint.js';
const router = Router();

router.use('/:id/subcategory', subCategoryRouter);
router.get('/', auth(endPoint.getAll), categoriesContoller.getCategories);
router.get('/active', auth(endPoint.getActive), categoriesContoller.getActiveCategory);
router.get('/:id', auth(endPoint.spesific), categoriesContoller.getSpecificCategory);
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), categoriesContoller.createCategory);
router.patch('/:id', auth(endPoint.update), fileUpload(fileValidation.image).single('image'), categoriesContoller.updateCategory);

export default router;