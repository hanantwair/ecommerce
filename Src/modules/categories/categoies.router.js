import { Router } from 'express';
import * as categoriesContoller from './categories.controller.js';
import fileUpload, { fileValidation } from '../../services/multer.js'
const router = Router();

router.get('/', categoriesContoller.getCategories);
router.get('/active', categoriesContoller.getActiveCategory);
router.get('/:id', categoriesContoller.getSpecificCategory);

router.post('/', fileUpload(fileValidation.image).single('image'), categoriesContoller.createCategory);
router.patch('/:id', fileUpload(fileValidation.image).single('image'), categoriesContoller.updateCategory);

export default router;