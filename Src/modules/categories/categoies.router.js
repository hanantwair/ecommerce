import { Router } from 'express';
import * as categoriesContoller from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js';
import subCategoryRouter from '../subcategory/subcategory.router.js';
import { auth } from '../../middleware/auth.js';
import { endpoint } from './categories.endpoint.js';
const router = Router();

router.use('/:id/subcategory', subCategoryRouter);
router.get('/', auth(endpoint.getAll), categoriesContoller.getCategories);
router.get('/active', auth(endpoint.getActive), categoriesContoller.getActiveCategory);
router.get('/:id', auth(endpoint.spesific), categoriesContoller.getSpecificCategory);
router.post('/', auth(endpoint.create), fileUpload(fileValidation.image).single('image'), categoriesContoller.createCategory);
router.patch('/:id', auth(endpoint.update), fileUpload(fileValidation.image).single('image'), categoriesContoller.updateCategory);

export default router;